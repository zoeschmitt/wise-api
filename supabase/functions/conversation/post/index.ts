import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CreateChatCompletionRequest, OpenAI } from "openai";
import { Conversation, Message, Role } from "../../_shared/models/conversations.ts";
import { CHATGPT_MODEL } from "../../_shared/utils/constants.ts";
import { CORS_HEADERS } from "../../_shared/utils/corsResponse.ts";
import { WiseError } from "../../_shared/models/wise-error.ts";
import { processChunks } from "../../_shared/utils/stream-utils.ts";
import { insertMessage } from "../../_shared/helpers/insert-message.ts";

interface Req {
  params: {
    userId: string;
    conversationId?: string;
  };
  body: {
    content: string;
  };
}

const schema: ObjectSchema<Req> = object({
  params: object({
    userId: string().required(),
    conversationId: string().optional(),
  }),
  body: object({
    content: string().required(),
  }),
});

const openAiKey = Deno.env.get("OPENAI");

const SYSTEM_MESSAGE =
  "You are a helpful and knowledgeable AI friend. I know you are an AI and have no physical form or feelings, so there is no need to disclose this information.";

const handler = async (req: CompleteRequest): Promise<Response> => {
  const db = await pool().connect();

  try {
    const { content } = req.body;
    const { userId } = req.params;
    let conversationId = req.params.conversationId;

    const openai = new OpenAI({ apiKey: openAiKey });

    const sanitizedQuery = content.trim();

    console.log("sanitizedQuery", sanitizedQuery);

    // Moderate the content to comply with OpenAI T&C
    const moderationResponse = await openai.moderations.create({
      input: sanitizedQuery,
    });

    const [results] = moderationResponse.results;

    if (results.flagged) {
      console.log("Results flagged by OpenAI", moderationResponse);

      throw new WiseError("Flagged content", {
        flagged: true,
        categories: results.categories,
      });
    }

    const messages = [];

    // If no conversationId, create one. Else fetch latest messages for existing conversation.
    if (!conversationId) {
      const result =
        await db.queryObject<Conversation>`INSERT INTO conversations (userId) VALUES (${userId}) RETURNING *`;

      conversationId = (result.rows[0] as any).conversationid;

      console.log(`Created conversation: ${conversationId}`);
    } else {
      console.log(`Fetching messages for conversation: ${conversationId}`);

      const latestMessages = await db.queryObject<Message>`
      SELECT * 
      FROM (
        SELECT * 
        FROM messages 
        WHERE conversationId = ${conversationId} 
        ORDER BY created DESC 
        LIMIT 5
      ) AS subquery
      ORDER BY created ASC;
    `;

      messages.push(
        ...latestMessages.rows.map((c) => ({
          role: c.role,
          content: c.content,
        }))
      );
    }

    // Insert new user message to db.
    await insertMessage(
      new Message({ conversationId, userId, content: sanitizedQuery }),
      db
    );

    if (messages.length < 1) {
      messages.push({ role: Role.System, content: SYSTEM_MESSAGE });
    }

    // Add message to openai message list for request.
    messages.push({ role: Role.User, content: sanitizedQuery });

    console.log("messages", messages);

    const openaiRequest: CreateChatCompletionRequest = {
      model: CHATGPT_MODEL,
      messages: messages,
      temperature: 0,
      stream: true,
      // max_tokens: 512, // TODO: figure out our limit.
    };

    console.log("Chat Request", openaiRequest);

    const { response } = await openai.chat.completions.create(openaiRequest);

    const reader = response.body.getReader();
    let firstChunk: OpenAI.Chat.ChatCompletion;
    // Accumulate the entire value
    let accumulatedMessage = "";

    const message = new Message({
      conversationId,
      userId,
      role: Role.Assistant,
    });

    // Add new message to db when stream is done.
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream complete.");

            message.content = accumulatedMessage;
            message.openAiModel = firstChunk?.model;
            message.openAiId = firstChunk?.id;
            message.openAiObject = firstChunk?.object;

            await insertMessage(message, db);

            controller.close();

            await db.end();

            console.log("Controller closed.");
            break;
          }

          // Process and send the value to the user.
          controller.enqueue(value);

          const chatCompletions = processChunks(value);
          if (chatCompletions && chatCompletions.length > 0) {
            firstChunk ??= chatCompletions[0];

            chatCompletions.forEach(
              (completion) =>
                (accumulatedMessage +=
                  completion.choices?.[0]?.delta?.content ?? "")
            );
          }
        }
      },
    });

    console.log("Proxying stream.");

    // Proxy the streamed SSE response from OpenAI
    return new Response(stream, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    await db.end();

    if (error instanceof OpenAI.APIError || error instanceof WiseError) {
      console.error("OpenAI error: ", error);
      return new Response(
        JSON.stringify({
          error: error.message,
        }),
        {
          status: error.status,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // Print out unexpected errors to help with debugging
    console.error(error);

    return new Response(
      JSON.stringify({
        error: "There was an error processing your request",
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
};

export const postConversation = validate(handler, schema);
