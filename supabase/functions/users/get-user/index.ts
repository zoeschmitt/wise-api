import { Request, Response } from "express";
import { ObjectSchema, object, string } from "yup";
import { serve } from "std/server";
import { Pool } from "postgres";

// Create a database pool with one connection.
const pool = new Pool(
  {
    tls: { enabled: false },
    database: "postgres",
    hostname: Deno.env.get("DB_HOSTNAME"),
    user: "postgres",
    port: 5432,
    password: Deno.env.get("DB_PASSWORD"),
  },
  1
);
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

serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}!`,
  };

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

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
