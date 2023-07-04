import { Configuration, OpenAIApi } from "openai";

export const openAiAPI = (): OpenAIApi => {
  const { OPENAI } = process.env;
  const configuration = new Configuration({
    apiKey: OPENAI,
  });
  return new OpenAIApi(configuration);
};
