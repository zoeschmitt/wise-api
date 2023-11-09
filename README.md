# Wise API

## Technologies

- [Supabase](https://supabase.com)
  - [PostgreSQL Database](https://supabase.com/database).
  - [Edge Functions](https://supabase.com/edge-functions).
- [PostgreSQL](postgresql.org)
- [Deno](https://deno.com)
- TypeScript

## Setting up local environment

1. [Install the Supabase CLI](https://github.com/supabase/cli).
1. [Install the Deno Client](https://deno.land/manual/getting_started/installation).
1. Login to the Supabase CLI using the command: supabase login. [Docs](https://supabase.com/docs/reference/cli/supabase-login).
1. Setup env variables using the .env.local template.

## Develop

Run functions locally:

```sh
deno task local
```

The functions will automatically update when you make any changes.

## Deploy

```sh
deno task deploy
```

## Database Migrations and Seed Data

[Supabase Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
