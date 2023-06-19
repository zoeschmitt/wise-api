import { Request, Response } from "express";
import { ObjectSchema, object, string } from "yup";
import { dbClient } from "../../../utils/db";
import { validate } from "../../../utils/validate";
import { ErrorCodes, apiError } from "../../../utils/errors";

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

const handler = async (req: Request, res: Response) => {
  const body = req.body;

  const client = dbClient();
  await client.connect();

  console.log("db connected");

  try {
    const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
    const values = [body.name, body.email];
    const result = await client.query(query, values);

    const user = result.rows[0];
    console.log("new user:", user);

    return res.send(user);
  } catch (error) {
    console.error("error:", error);
    return apiError(res, ErrorCodes.SERVER_ERROR);
  } finally {
    await client.end();
  }
};

export const postUser = validate(handler, schema);
