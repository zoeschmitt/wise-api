DROP TABLE IF EXISTS public.conversations;

CREATE TABLE IF NOT EXISTS public.conversations
(
    conversationid uuid NOT NULL DEFAULT gen_random_uuid(),
    userid uuid,
    title text COLLATE pg_catalog."default",
    created timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT conversations_pkey PRIMARY KEY (conversationid),
    CONSTRAINT conversations_userid_fkey FOREIGN KEY (userid)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.conversations
    OWNER to postgres;

GRANT ALL ON TABLE public.conversations TO anon;

GRANT ALL ON TABLE public.conversations TO authenticated;

GRANT ALL ON TABLE public.conversations TO postgres;

GRANT ALL ON TABLE public.conversations TO service_role;