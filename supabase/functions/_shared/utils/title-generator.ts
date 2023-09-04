import { CreateChatCompletionRequest } from "openai";
import { CHATGPT_MODEL } from "./constants.ts";

const titleGenerator = async (message: string) => {
  const limitedStr = message.substring(0, 500);

  const openaiRequest: CreateChatCompletionRequest = {
    model: CHATGPT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "Create titles for the content you are provided (it may be up to 6 words). Without quotation marks.",
      },
      {
        role: "user",
        content: limitedStr,
      },
    ],
  };

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

  const title = completion.choices[0].message.content;

  console.log(`Creating title for: ${limitedStr} - ${title}`);

  return title ?? message.substring(0, 30);
};

export default titleGenerator;
