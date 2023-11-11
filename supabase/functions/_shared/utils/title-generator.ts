import { CreateChatCompletionRequest } from "openai";
import { CHATGPT_MODEL, OPEN_AI_URLS } from "./constants.ts";
import { RequestMethod } from "../models/requests.ts";
import { openAiRequest } from "./openai-request.ts";

const titleGenerator = async (message: string) => {
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

  const openAiResponse = await openAiRequest({
    url: OPEN_AI_URLS.chatCompletion,
    type: RequestMethod.POST,
    body: JSON.stringify(openaiRequest),
  });

  const completion = await openAiResponse.json();

  const title = completion.choices[0].message.content;

  console.log(`Creating title for: ${limitedStr} - ${title}`);

  return title ?? message.substring(0, 50);
};

export default titleGenerator;
