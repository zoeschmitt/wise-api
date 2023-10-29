DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    userid uuid NOT NULL DEFAULT gen_random_uuid(),
    name text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    created timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (userid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

GRANT ALL ON TABLE public.users TO anon;

GRANT ALL ON TABLE public.users TO authenticated;

GRANT ALL ON TABLE public.users TO postgres;

GRANT ALL ON TABLE public.users TO service_role;