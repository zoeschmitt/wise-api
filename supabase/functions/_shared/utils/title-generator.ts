import { CreateChatCompletionRequest } from "openai";
import { CHATGPT_MODEL } from "./constants.ts";
import { OpenAI } from "https://esm.sh/openai@4.0.0";

const titleGenerator = async (openai: OpenAI, message: string) => {
  const limitedStr = message.substring(0, 500);

  const openaiRequest: CreateChatCompletionRequest = {
    model: CHATGPT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You will be provided with the first message in a conversation, and your task is to generate a title for this conversation up to 6 words.",
      },
      {
        role: "user",
        content: limitedStr,
      },
    ],
  };

  const chatCompletion = await openai.chat.completions.create(openaiRequest);
  const title = chatCompletion.choices[0].message

  console.log(`Creating title for: ${limitedStr} - ${title}`);

  return title ?? message.substring(0, 50);
};

export default titleGenerator;
