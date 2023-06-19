import { Request, Response } from "@google-cloud/functions-framework";
import { dbClient } from "../../../utils/db";
import { ObjectSchema, object, string } from "yup";
import { ErrorCodes, apiError } from "../../../utils/errors";
import { validate } from "../../../utils/validate";

interface Req {
  query: {
    userId: string;
    conversationId: string;
  };
}

const schema: ObjectSchema<Req> = object({
  query: object({
    userId: string().required(),
    conversationId: string().required(),
  }),
});

const handler = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const conversationId = req.query.conversationId;

  const client = dbClient();
  await client.connect();

  console.log("connected");

  try {
    const statement = {
      name: "fetch-conversation",
      text: "SELECT * FROM conversations WHERE userId = $1 AND conversationId = $2",
      values: [userId, conversationId],
    };

    const result = await client.query(statement);

    const conversation = result.rows;
    console.log("conversation:", conversation);

    res.send(conversation);
  } catch (error) {
    console.error("error:", error);
    return apiError(res, ErrorCodes.SERVER_ERROR);
  } finally {
    await client.end();
  }
};

export const getConversation = validate(handler, schema);
