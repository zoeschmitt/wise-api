import { Configuration, OpenAIApi } from "openai";

export const openAiAPI = (): OpenAIApi => {
  const OPENAI = Deno.env.get("OPENAI");
  const configuration = new Configuration({
    apiKey: OPENAI,
  });
  return new OpenAIApi(configuration);
};
