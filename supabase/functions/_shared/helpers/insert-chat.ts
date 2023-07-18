import { PoolClient } from "postgres";
import { Chat } from "../models/chats.ts";
import { getInsertProperties, getInsertValues } from "../utils/db.ts";

export const insertChat = async (
  chat: Chat,
  client: PoolClient
): Promise<void> => {
  const insertProps = getInsertProperties(chat);
  const insertVals = getInsertValues(insertProps);

  const query = `
  INSERT INTO chats (${insertProps.join(", ")})
  VALUES (${insertVals.join(", ")})`;

  const values = insertProps.map((p) => chat[p as keyof Chat]);

  await client.queryArray<any[]>(query, values);
};
