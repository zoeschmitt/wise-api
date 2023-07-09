import { pool } from "../../_shared/utils/db.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";

interface Req {
  userId: string;
}

const schema: ObjectSchema<Req> = object({
  userId: string().required(),
});

const handler = async (req: Request): Promise<Response> => {
  const { userId } = await req.json();

  console.log(req.json());

  const db = await pool().connect();

  try {
    const result =
      await db.queryObject`SELECT * FROM users WHERE userId = ${userId}`;

    const user = result.rows;
    console.log("user:", user);

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
