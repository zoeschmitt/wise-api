import { Client } from "pg";
import { PREP_KEYS } from "../utils/constants";
import { Chats } from "../models/chats";

export const selectChats = async (
  conversationId: string,
  client: Client,
  limit: number = 5
): Promise<Chats[]> => {
  const statement = {
    name: PREP_KEYS.FETCH_CONVERSATION,
    text: `SELECT * FROM chats WHERE conversationId = $1 ORDER BY created ASC LIMIT ${limit}`,
    values: [conversationId],
  };

  const result = await client.query(statement);

  return result.rows;
};
