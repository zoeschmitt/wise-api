import { Pool } from "postgres";

export const pool = () => {
  const SUPABASE_DB_URL = Deno.env.get("SUPABASE_DB_URL")!;

  return new Pool(SUPABASE_DB_URL, 1, true);
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
