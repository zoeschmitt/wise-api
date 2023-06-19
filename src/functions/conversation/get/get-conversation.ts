import { Request, Response } from "@google-cloud/functions-framework";
import { dbClient, isString } from "../../../utils/utils";

export const getConversation = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;

  if (!isString(userId))
    return res.status(400).json({ error: "Invalid userId." });

  if (!isString(conversationId))
    return res.status(400).json({ error: "Invalid conversationId." });

  const client = dbClient();
  await client.connect();

  console.log("connected");

  try {
    // Prepare the statement
    const statement = {
      name: "fetch-conversation",
      text: "SELECT * FROM conversations WHERE userId = $1 AND conversationId = $2",
      values: [userId, conversationId],
    };

    // Execute the prepared statement
    const result = await client.query(statement);

    // Access the query result rows
    const conversation = result.rows;
    console.log("conversation:", conversation);

    res.send(conversation);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await client.end();
  }
};
