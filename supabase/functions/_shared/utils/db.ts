import { Pool } from "postgres";

export const pool = () => {
  // Create a database pool with one connection.
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } =
    Deno.env.toObject();
  return new Pool(
    {
      tls: { enabled: false },
      database: DB_NAME,
      hostname: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      password: DB_PASSWORD,
    },
    1
  );
};

export const getInsertProperties = <T>(obj: T): string[] => {
  const properties = [];
  for (const key in obj) {
    if (obj[key]) properties.push(key);
  }
  return properties;
};

export const getInsertValues = <T>(insertProperties: T[]): string[] => {
  const values: string[] = [];
  insertProperties.forEach((_, i) => values.push(`$${i + 1}`));
  return values;
};
