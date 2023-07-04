import { Client } from "pg";
import { PREP_KEYS } from "../utils/constants";
import { Conversations } from "../models/conversations";

export const selectConversation = async (
  conversationId: string,
  client: Client
): Promise<Conversations> => {
  const statement = {
    name: PREP_KEYS.FETCH_CONVERSATION,
    text: "SELECT * FROM conversations WHERE conversationId = $1",
    values: [conversationId],
  };

  const result = await client.query(statement);

  return result.rows[0];
};
