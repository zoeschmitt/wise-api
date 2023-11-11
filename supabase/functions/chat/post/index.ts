import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CreateChatCompletionRequest, OpenAI } from "openai";
import { Chat, ChatRole } from "../../_shared/models/chats.ts";
import { Conversation } from "../../_shared/models/conversations.ts";
import { CHATGPT_MODEL } from "../../_shared/utils/constants.ts";
import { insertChat } from "../../_shared/helpers/insert-chat.ts";
import { CORS_HEADERS } from "../../_shared/utils/corsResponse.ts";
import { WiseError } from "../../_shared/models/wise-error.ts";
import { processChunks } from "../../_shared/utils/stream-utils.ts";

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

    const openaiMessages = [];

    // If no conversationId, create one. Else fetch latest chats for existing conversation.
    if (!conversationId) {
      const result =
        await db.queryObject<Conversation>`INSERT INTO conversations (userId) VALUES (${userId}) RETURNING *`;

      conversationId = (result.rows[0] as any).conversationid;

      console.log(`Created conversation: ${conversationId}`);
    } else {
      console.log(`Fetching chats for conversation: ${conversationId}`);

      const latestMessages =
        await db.queryObject<Chat>`SELECT * FROM chats WHERE conversationId = ${conversationId} ORDER BY created DESC LIMIT 5`;

      openaiMessages.push(
        ...latestMessages.rows.map((c) => ({
          role: c.role,
          content: c.content,
        }))
      );
    }

    console.log("inserting chat");

    // Insert new user chat to db.
    await insertChat(
      new Chat({ conversationId, userId, content: sanitizedQuery }),
      db
    );

    // Add chat to openai message list for request.
    openaiMessages.push({ role: ChatRole.User, content: sanitizedQuery });

    const openaiRequest: CreateChatCompletionRequest = {
      model: CHATGPT_MODEL,
      messages: openaiMessages,
      temperature: 0,
      stream: true,
      // max_tokens: 512, // TODO: figure out our limit.
    };

    console.log("Chat Request", openaiRequest);

    const { response } = await openai.chat.completions.create(openaiRequest);

    console.log(response);

    const reader = response.body.getReader();
    let firstChunk: OpenAI.Chat.ChatCompletion;
    // Accumulate the entire value
    let accumulatedMessage = "";

    // Add new chat to db when stream is done.
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            const newChat = new Chat({
              conversationId,
              userId,
              role: ChatRole.Assistant,
              content: accumulatedMessage,
              openAiModel: firstChunk?.model,
              openAiId: firstChunk?.id,
              openAiObject: firstChunk?.object,
            });

            await insertChat(newChat, db);

            controller.close();

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

    // Proxy the streamed SSE response from OpenAI
    return new Response(stream, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
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
  } finally {
    await db.end();
  }
};

export const postChat = validate(handler, schema);
