import { Request, Response } from "@google-cloud/functions-framework";
import { OpenAIApi } from "openai";
import { CHATGPT_MODEL } from "../../../utils/constants";
import { openAiAPI } from "../../../utils/utils";

export const getConversations = async (req: Request, res: Response) => {
  const user = req.query.user;

  if (!user || typeof user !== "string")
    return res.status(400).json({ error: "Invalid user id." });

  const openai: OpenAIApi = openAiAPI();

  const completion = await openai
    .createChatCompletion({
      model: CHATGPT_MODEL,
      messages: [{ role: "user", content: "Hello world" }],
    })
    .catch((err) => console.log(err));

  res.send(completion?.data);
};
