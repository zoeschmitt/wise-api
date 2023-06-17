import { Request, Response } from "@google-cloud/functions-framework";
import { dbClient } from "../../../utils/utils";

export const getConversations = async (req: Request, res: Response) => {
  const user = req.query.user;

  if (!user || typeof user !== "string")
    return res.status(400).json({ error: "Invalid user id." });

  const client = dbClient();
  await client.connect();

  console.log("connected");

  try {
    // Execute the query
    const query = "SELECT * FROM conversations WHERE userId = $1";
    const values = [user];
    const result = await client.query(query, values);

    // Access the query result rows
    const conversations = result.rows;
    console.log("Conversations:", conversations);

    res.send(conversations);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await client.end();
  }
};
