import { PoolClient } from "postgres";
import { Chat } from "../models/chats.ts";
import { getInsertProperties, getInsertValues } from "../utils/db.ts";

/**
 * Inserts a new chat record into the database using the provided `chat` object.
 *
 * @param {Chat} chat - The chat object representing the data to be inserted.
 * @param {PoolClient} client - The PostgreSQL pool client to perform the database operation.
 * @returns {Promise<void>} A Promise that resolves when the insertion is successful, or rejects with an error on failure.
 *
 * @example
 * // Usage example:
 * const chatData = { id: 1, content: "Hello, world!", userId: 42 };
 * const client = await pool.connect();
 * await insertChat(chatData, client);
 * client.release();
 */
export const insertChat = async (
  chat: Chat,
  client: PoolClient
): Promise<Chat> => {
  const insertProps = getInsertProperties(chat);
  const insertVals = getInsertValues(insertProps);

  const query = `
  INSERT INTO chats (${insertProps.join(", ")})
  VALUES (${insertVals.join(", ")})
  RETURNING *
  `;

  const values = insertProps.map((p) => chat[p as keyof Chat]);

  const result = await client.queryObject<Chat>(query, values);

  return result.rows[0];
};
