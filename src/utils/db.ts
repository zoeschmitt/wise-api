import { Client } from "pg";

export const dbClient = (): Client => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  return new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  });
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
