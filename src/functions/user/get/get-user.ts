import { Request, Response } from "express";
import { ObjectSchema, object, string } from "yup";
import { dbClient } from "../../../utils/db";
import { validate } from "../../../utils/validate";
import { ErrorCodes, apiError } from "../../../utils/errors";

interface Req {
  query: {
    userId: string;
  };
}

const schema: ObjectSchema<Req> = object({
  query: object({
    userId: string().required(),
  }),
});

const handler = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  const client = dbClient();
  await client.connect();

  try {
    const query = "SELECT * FROM users WHERE userId = $1";
    const values = [userId];
    const result = await client.query(query, values);

    const user = result.rows;
    console.log("user:", user);

    res.send(user);
  } catch (error) {
    console.error("error:", error);
    return apiError(res, ErrorCodes.SERVER_ERROR);
  } finally {
    await client.end();
  }
};

export const getUser = validate(handler, schema);
