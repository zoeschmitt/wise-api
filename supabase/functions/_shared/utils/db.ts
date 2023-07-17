import { Pool } from "postgres";

export const pool = () => {
  const SUPABASE_DB_URL = Deno.env.get("SUPABASE_DB_URL")!;

  return new Pool(SUPABASE_DB_URL, 1, true);
};
