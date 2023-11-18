import { Conversation } from "../../_shared/models/conversations.ts";
import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CORSResponse } from "../../_shared/utils/corsResponse.ts";

interface Req {
  params: {
    conversationId: string;
  };
}

const schema: ObjectSchema<Req> = object({
  params: object({
    conversationId: string().required(),
  }).required(),
});

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { conversationId } = req.params;

  const db = await pool().connect();

  try {
    const result = await db.queryObject<Conversation>`SELECT
        c.conversationid,
        c.userid,
        c.title,
        c.created,
        c.updated,
        json_agg(ch) AS messages
      FROM
        public.conversations AS c
      JOIN
        public.messages AS ch
        ON c.conversationid = ch.conversationid
      WHERE
        c.conversationid = ${conversationId}
      GROUP BY
        c.conversationid,
        c.userid,
        c.title,
        c.created,
        c.updated;`;

    const conversations = result.rows[0];

    return new CORSResponse(conversations);
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  } finally {
    await db.end();
  }
};

export const getConversation = validate(handler, schema);
