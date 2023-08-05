import { CompleteRequest } from "../../_shared/models/requests.ts";
import { User } from "../../_shared/models/users.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";

interface Req {
  params: {
    userId?: string;
    email?: string;
  };
}

const schema: ObjectSchema<Req> = object({
  params: object({
    userId: string(),
    email: string(),
  }).required(),
}).test(
  "at-least-one-property",
  "You must provide an email or userId.",
  (value) => !!(value.params.userId || value.params.email)
);

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { userId, email } = req.params;

  const db = await pool().connect();

  try {
    const result = userId
      ? await db.queryObject<User>`SELECT * FROM users WHERE userId = ${userId}`
      : await db.queryObject<User>`SELECT * FROM users WHERE email = ${email}`;

    const user = result.rows[0];

    if (!user)
      return apiError(ErrorCodes.NOT_FOUND, { error: "User not found." });

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
