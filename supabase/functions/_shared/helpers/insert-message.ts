import { PoolClient } from "postgres";
import { getInsertProperties, getInsertValues } from "../utils/db.ts";
import { Message } from "../models/conversations.ts";

/**
 * Inserts a new message record into the database using the provided `message` object.
 *
 * @param {Message} message - The message object representing the data to be inserted.
 * @param {PoolClient} client - The PostgreSQL pool client to perform the database operation.
 * @returns {Promise<void>} A Promise that resolves when the insertion is successful, or rejects with an error on failure.
 *
 * @example
 * // Usage example:
 * const messageData = { id: 1, content: "Hello, world!", userId: 42 };
 * const client = await pool.connect();
 * await insertmessage(messageData, client);
 * client.release();
 */
export const insertMessage = async (
  message: Message,
  client: PoolClient
): Promise<Message | undefined> => {
  try {
    const insertProps = getInsertProperties(message);
    const insertVals = getInsertValues(insertProps);

    const query = `
  INSERT INTO messages (${insertProps.join(", ")})
  VALUES (${insertVals.join(", ")})
  RETURNING *
  `;

    const values = insertProps.map((p) => message[p as keyof Message]);

    const result = await client.queryObject<Message>(query, values);

    return result.rows[0];
  } catch (error) {
    console.log("Error inserting message", message, error);
    throw error;
  }
};
