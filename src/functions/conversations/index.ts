import { Request, Response } from "@google-cloud/functions-framework";
import { OpenAIApi } from "openai";
import { openAiAPI } from "../../utils/utils";

export const conversations = async (req: Request, res: Response) => {
  const openai: OpenAIApi = openAiAPI();

  console.log(req)

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hello world" }],
  }).catch(err => console.log(err));

  res.send(completion?.data.choices[0].message);
};
