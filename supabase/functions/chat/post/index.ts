import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CreateChatCompletionRequest } from "openai";
import { Chat, ChatRole } from "../../_shared/models/chats.ts";
import { Conversation } from "../../_shared/models/conversations.ts";
import { CHATGPT_MODEL } from "../../_shared/utils/constants.ts";
import { insertChat } from "../../_shared/helpers/insert-chat.ts";

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

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { content } = req.body;
  const { userId } = req.params;
  let conversationId = req.params.conversationId;

  const db = await pool().connect();

  try {
    const openAiChats = [];
    const chats: Chat[] = [];

    if (!conversationId) {
      console.log(`no conversation id, creating...`);

      const result = await db.queryObject<Conversation>`INSERT INTO conversations (userId) VALUES (${userId}) RETURNING *`;

      conversationId = (result.rows[0] as any).conversationid;

      console.log(`created conversation with id: ${conversationId}`);
    } else {
      console.log(
        `fetching latest chats for conversation id: ${conversationId}`
      );

      const latestChats =
        await db.queryObject<Chat>`SELECT * FROM chats WHERE conversationId = ${conversationId} ORDER BY created ASC LIMIT 5`;

      openAiChats.push(
        ...latestChats.rows.map((c) => ({
          role: c.role,
          content: c.content,
        }))
      );
    }

    openAiChats.push({ role: ChatRole.User, content });

    chats.push(new Chat({ conversationId, userId, content }));

    console.log(`sending ${openAiChats.length} chats to OpenAI...`);

    const openaiRequest: CreateChatCompletionRequest = {
      model: CHATGPT_MODEL,
      messages: openAiChats,
      temperature: 0,
    };

    console.log("Chat Request", openaiRequest);

    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("OPENAI")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(openaiRequest),
      }
    );

    const completion = await openAiResponse.json();

    console.log(`OpenAI response ${openAiResponse.status}`, completion);

    const chatResponse = new Chat({
      conversationId,
      userId,
      role: ChatRole.Assistant,
      content: completion?.choices?.[0].message?.content,
      promptTokens: completion?.usage?.prompt_tokens,
      completionTokens: completion?.usage?.completion_tokens,
      openAiModel: completion?.model,
      openAiId: completion?.id,
      openAiObject: completion?.object,
    });

    chats.push(chatResponse);

    console.log(`inserting chats into db...`, chats);

    for (const chat of chats) {
      await insertChat(chat, db);
    }

    console.log(`request complete`);

    return new Response(JSON.stringify(chatResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  } finally {
    await db.end();
  }
};

export const postChat = validate(handler, schema);