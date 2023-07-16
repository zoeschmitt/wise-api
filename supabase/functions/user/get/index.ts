import { CompleteRequest } from "../../_shared/models/requests.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { getRequestParams, validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";

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
      await db.queryObject`SELECT * FROM users WHERE userId = ${userId}`;

    const user = result.rows[0];

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  } finally {
    await db.end();
  }
};

export const getUser = validate(handler, schema);
