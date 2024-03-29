import {
  getInsertProperties,
  getInsertValues,
  pool,
} from "../../../../supabase/functions/_shared/utils/db.ts";
import { assertEquals } from "https://deno.land/std@0.195.0/assert/assert_equals.ts";
import { Pool } from "postgres";

Deno.test(
  "getInsertProperties should extract non-null insert properties",
  () => {
    // Sample object with insert properties, including some null properties
    const obj = { field1: "value1", field2: null, field3: "value3" };

    // Call the function to be tested
    const insertProperties = getInsertProperties(obj);

    // Expected result based on the sample object
    const expectedInsertProperties = ["field1", "field3"];

    // Assertion - Check if the actual and expected insert properties match
    assertEquals(insertProperties, expectedInsertProperties);
  }
);

Deno.test("getInsertValues should generate the correct insert values", () => {
  // Sample insert properties
  const insertProperties = ["field1", "field2", "field3"];

  // Call the function to be tested
  const insertValues = getInsertValues(insertProperties);

  // Expected result based on the sample insert properties
  const expectedInsertValues = ["$1", "$2", "$3"];

  // Assertion - Check if the actual and expected insert values match
  assertEquals(insertValues, expectedInsertValues);
});

Deno.test(
  "pool should create a PostgreSQL connection pool with the provided database URL",
  () => {
    // Mock the environment variable
    const originalEnv = Deno.env.get;
    Deno.env.get = () =>
      "postgres://username:password@localhost:5432/database_name";

    try {
      // Call the function to be tested
      const dbPool = pool();

      // Assertion - Check if a Pool instance is returned
      assertEquals(dbPool instanceof Pool, true);
    } finally {
      // Restore the original env.get function to its previous state
      Deno.env.get = originalEnv;
    }
  }
);
