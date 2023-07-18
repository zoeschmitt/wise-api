import { Conversation } from "../../_shared/models/conversations.ts";
import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";

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
    const result =
      await db.queryObject<Conversation>`SELECT
      c.conversationid,
      c.userid,
      c.title,
      c.created,
      c.updated,
      json_agg(json_build_object(
        'conversationId', ch.conversationid,
        'created', ch.created,
        'role', ch.role,
        'userId', ch.userid,
        'content', ch.content,
        'promptTokens', ch.prompttokens,
        'completionTokens', ch.completiontokens,
        'openAiModel', ch.openaimodel,
        'openAiId', ch.openaiid,
        'openAiObject', ch.openaiobject
      )) AS chats
    FROM
      public.conversations AS c
    JOIN
      public.chats AS ch
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

    return new Response(JSON.stringify(conversations), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  } finally {
    await db.end();
  }
};

export const getConversation = validate(handler, schema);