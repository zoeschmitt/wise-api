import { Conversation } from "../../_shared/models/conversations.ts";
import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CORSResponse } from "../../_shared/utils/corsResponse.ts";

interface Req {
  params: {
    userId: string;
  };
}

const schema: ObjectSchema<Req> = object({
  params: object({
    userId: string().required(),
  }).required(),
});

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { userId } = req.params;

  const db = await pool().connect();

  try {
    const result =
      await db.queryObject<Conversation>`SELECT * FROM conversations WHERE userId = ${userId} ORDER BY updated DESC`;

    const conversations = result.rows;

    return new CORSResponse(conversations);
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  } finally {
    await db.end();
  }
};

export const getConversations = validate(handler, schema);
