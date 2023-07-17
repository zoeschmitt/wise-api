import { CompleteRequest } from "../../_shared/models/requests.ts";
import { User } from "../../_shared/models/users.ts";
import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";

interface Req {
  body: {
    name: string;
    email: string;
  };
}

const schema: ObjectSchema<Req> = object({
  body: object({
    name: string().required(),
    email: string().required(),
  }),
});

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { name, email } = req.body;

  const db = await pool().connect();

  try {
    const result =
      await db.queryObject<User>`INSERT INTO users (name, email) VALUES (${name}, ${email}) RETURNING *`;

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

export const postUser = validate(handler, schema);
