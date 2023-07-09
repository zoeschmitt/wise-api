import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";

interface Req {
  name: string;
  email: string;
}

const schema: ObjectSchema<Req> = object({
  name: string().required(),
  email: string().required(),
});

const handler = async (req: Request): Promise<Response> => {
  const { name, email } = await req.json();

  console.log(req.json());

  const db = await pool().connect();

  try {
    const result =
      await db.queryObject`INSERT INTO users (name, email) VALUES (${name}, ${email}) RETURNING *`;

    const user = result.rows[0];
    console.log("new user:", user);

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
