import { Client } from "pg";
import { PREP_KEYS } from "../utils/constants";

export const fetchConversation = async (id: string, client: Client) => {
  const statement = {
    name: PREP_KEYS.FETCH_CONVERSATION,
    text: "SELECT * FROM conversations WHERE conversationId = $1",
    values: [id],
  };

  const result = await client.query(statement);

  return result.rows;
};
