import { Configuration, OpenAIApi } from "openai";
import { Client } from "pg";

export const openAiAPI = (): OpenAIApi => {
  const { OPENAI } = process.env;
  const configuration = new Configuration({
    apiKey: OPENAI,
  });
  return new OpenAIApi(configuration);
};

export const dbClient = (): Client => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  return new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  });
};
