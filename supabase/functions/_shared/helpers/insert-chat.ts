import { Client } from "pg";
import { Chats } from "../models/chats";
import { getInsertProperties, getInsertValues } from "../utils/db";

export const insertChat = async (
  chat: Chats,
  client: Client
): Promise<Chats[]> => {
  const insertProps = getInsertProperties(chat);
  const insertVals = getInsertValues(insertProps);

  const query = `
  INSERT INTO chats (${insertProps.join(", ")})
  VALUES (${insertVals.join(", ")})
  RETURNING *`;

  const values = insertProps.map((p) => chat[p as keyof Chats]);

  const result = await client.query(query, values);

  return result.rows;
};
