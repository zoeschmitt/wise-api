import { Request, Response } from "express";
import { ObjectSchema, object, string } from "yup";
import { dbClient } from "../../../utils/db";
import { validate } from "../../../utils/validate";
import { ErrorCodes, apiError } from "../../../utils/errors";
import { openAiAPI } from "../../../utils/openai";
import { CHATGPT_MODEL } from "../../../utils/constants";
import {
  ChatCompletionResponseMessage,
  CreateChatCompletionRequest,
  OpenAIApi,
} from "openai";
import { Chats } from "../../../models/chats";

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
  const userId = req.query.conversationId;
  const chatContents = req.body.contents;
  let conversationId = req.query.conversationId;

  const client = dbClient();
  await client.connect();

  try {
    const chats: ChatCompletionResponseMessage[] = [];

    if (!conversationId) {
      // create conversation
    } else {
      // get conversation chats and add to chats list
    }

    const openai: OpenAIApi = openAiAPI();

    const openaiRequest: CreateChatCompletionRequest = {
      model: CHATGPT_MODEL,
      // messages: [{ role: "user", content: "Hello world" }],
      messages: chats,
    };

    const completion = await openai.createChatCompletion(openaiRequest);

    console.log(completion?.data);

    const chat: Partial<Chats> = {
      conversationId: conversationId as string,
      title: "",
      author: userId as string,
      contents: chatContents,
      promptTokens: "",
      completionTokens: "",
      openaiId: "",
      openaiObject: "",
      created: ""
    }

    const query = "INSERT INTO chats (name, email) VALUES ($1, $2) RETURNING *";
    const values = [body.name, body.email];
    const result = await client.query(query, values);

    const user = result.rows[0];
    console.log("new user:", user);

    return res.send(user);
  } catch (error) {
    console.error("error:", error);
    return apiError(res, ErrorCodes.SERVER_ERROR);
  } finally {
    await client.end();
  }
};

export const postChat = validate(handler, schema);
