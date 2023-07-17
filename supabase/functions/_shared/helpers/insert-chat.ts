import { PoolClient } from "postgres";
import { Chat } from "../models/chats.ts";

export const insertChat = async (
  chat: Chat,
  client: PoolClient
): Promise<Chat[]> => {
  const keys = Object.keys(chat);
  const values = Object.values(chat);

  const result = await client.queryObject<Chat>`
  INSERT INTO chats (${keys.join(", ")})
  VALUES (${values.join(", ")})
  RETURNING *`;

  return result.rows;
};
