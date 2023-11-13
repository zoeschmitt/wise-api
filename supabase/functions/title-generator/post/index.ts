import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CORSResponse } from "../../_shared/utils/corsResponse.ts";
import { Chat } from "../../_shared/models/chats.ts";
import titleGenerator from "../../_shared/utils/title-generator.ts";
import { OpenAI } from "https://esm.sh/openai@4.0.0";

interface Req {
  body: {
    record: {
      conversationid: string;
    };
  };
}

const schema: ObjectSchema<Req> = object({
  body: object({
    record: object({
      conversationid: string().required(),
    }).required(),
  }),
});

const openAiKey = Deno.env.get("OPENAI");

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { conversationid: conversationId } = req.body.record;

  const db = await pool().connect();

  try {
    const openai = new OpenAI({ apiKey: openAiKey });

    console.log("Generating title for conversation", conversationId);

    const firstChat =
      await db.queryObject<Chat>`SELECT * FROM chats WHERE conversationId = ${conversationId} ORDER BY created LIMIT 1`;

    console.log("First chat for conversation", firstChat.rows);

    const title = await titleGenerator(openai, firstChat.rows[0].content);

    console.log("Generated title", title);

    await db.queryObject({
      text: "UPDATE public.conversations SET title = $1 WHERE conversationid = $2",
      args: [title, conversationId],
    });

    console.log("Title updated");

    return new CORSResponse("ok");
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  } finally {
    await db.end();
  }
};

export const postTitle = validate(handler, schema);
