import { Request, Response } from "@google-cloud/functions-framework";
import { dbClient } from "../../../utils/db";
import { ObjectSchema, object, string } from "yup";
import { ErrorCodes, apiError } from "../../../utils/errors";
import { validate } from "../../../utils/validate";
import { selectConversation } from "../../../helpers/select-conversation";

interface Req {
  query: {
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
  const conversationId = req.query.conversationId;

  const client = dbClient();
  await client.connect();

  try {
    const conversation = selectConversation(conversationId as string, client);

    res.send(conversation);
  } catch (error) {
    console.error("error:", error);
    return apiError(res, ErrorCodes.SERVER_ERROR);
  } finally {
    await client.end();
  }
};

export const getConversation = validate(handler, schema);
