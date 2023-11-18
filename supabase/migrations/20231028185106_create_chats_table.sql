DROP TABLE IF EXISTS public.messages;

CREATE TABLE IF NOT EXISTS public.messages
(
    messagesid uuid NOT NULL DEFAULT gen_random_uuid(),
    conversationid uuid NOT NULL,
    created timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP,
    role role_enum,
    userid text COLLATE pg_catalog."default",
    content text COLLATE pg_catalog."default",
    prompttokens integer,
    completiontokens integer,
    openaimodel text COLLATE pg_catalog."default",
    openaiid text COLLATE pg_catalog."default",
    openaiobject text COLLATE pg_catalog."default",
    CONSTRAINT messages_pkey PRIMARY KEY (messagesid),
    CONSTRAINT messages_conversationid_fkey FOREIGN KEY (conversationid)
        REFERENCES public.conversations (conversationid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.messages
    OWNER to postgres;

GRANT ALL ON TABLE public.messages TO anon;

GRANT ALL ON TABLE public.messages TO authenticated;

GRANT ALL ON TABLE public.messages TO postgres;

GRANT ALL ON TABLE public.messages TO service_role;