import { Request, Response } from "express";
import { ObjectSchema, object, string } from "yup";
import { dbClient } from "../../../utils/db";
import { validate } from "../../../utils/validate";
import { ErrorCodes, apiError } from "../../../utils/errors";
import { openAiAPI } from "../../../utils/openai";
import { CHATGPT_MODEL } from "../../../utils/constants";
import { Chats } from "../../../models/chats";
import { selectChats } from "../../../helpers/select-chats";
import {
  ChatCompletionResponseMessage,
  ChatCompletionResponseMessageRoleEnum,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import { insertChat } from "../../../helpers/insert-chat";

interface Req {
  query: {
    userId: string;
    conversationId?: string;
  };
  body: {
    contents: string;
  };
}

const schema: ObjectSchema<Req> = object({
  query: object({
    userId: string().required(),
    conversationId: string().optional(),
  }),
  body: object({
    contents: string().required(),
  }),
});

const handler = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const chatContents = req.body.contents;
  let conversationId = req.query.conversationId as string | undefined;

  const client = dbClient();
  await client.connect();

  try {
    const openAiChats: ChatCompletionResponseMessage[] = [];
    const chats: Chats[] = [];

    if (!conversationId) {
      console.log(`no conversation id, creating...`);

      const query =
        "INSERT INTO conversations (userId) VALUES ($1) RETURNING *";

      const values = [userId];
      const result = await client.query(query, values);

      conversationId = result.rows[0].conversationId;

      console.log(`created conversation with id: ${conversationId}`);
    } else {
      console.log(
        `fetching latest chats for conversation id: ${conversationId}`
      );

      const latestChats = await selectChats(conversationId, client);

      openAiChats.push(
        ...latestChats.map((c) => ({
          role: c.role,
          content: c.content,
        }))
      );
    }

    openAiChats.push({
      role: ChatCompletionResponseMessageRoleEnum.User,
      content: chatContents,
    });

    chats.push(new Chats({ conversationId, userId, content: chatContents }));

    console.log(`sending ${openAiChats.length} chats to OpenAI...`);

    const openai: OpenAIApi = openAiAPI();

    const openaiRequest: CreateChatCompletionRequest = {
      model: CHATGPT_MODEL,
      messages: openAiChats,
    };

    const completion = await openai.createChatCompletion(openaiRequest);

    console.log(`OpenAI response ${completion.status}`);

    const chatResponse = new Chats({
      conversationId,
      userId,
      role: ChatCompletionResponseMessageRoleEnum.Assistant,
      content: completion?.data?.choices?.[0].message?.content,
      promptTokens: completion?.data?.usage?.prompt_tokens,
      completionTokens: completion?.data?.usage?.completion_tokens,
      openAiModel: completion?.data?.model,
      openAiId: completion?.data?.id,
      openAiObject: completion?.data?.object,
    });

    chats.push(chatResponse);

    console.log(`inserting chats into db...`);

    for (const chat of chats) {
      await insertChat(chat, client);
    }

    console.log(`request complete`);

    return res.send(chatResponse);
  } catch (error) {
    console.error("error:", error);
    return apiError(res, ErrorCodes.SERVER_ERROR);
  } finally {
    await client.end();
  }
};

export const postChat = validate(handler, schema);
