DROP TABLE IF EXISTS public.chats;

CREATE TABLE IF NOT EXISTS public.chats
(
    chatid uuid NOT NULL DEFAULT gen_random_uuid(),
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
    CONSTRAINT chats_pkey PRIMARY KEY (chatid),
    CONSTRAINT chats_conversationid_fkey FOREIGN KEY (conversationid)
        REFERENCES public.conversations (conversationid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chats
    OWNER to postgres;

GRANT ALL ON TABLE public.chats TO anon;

GRANT ALL ON TABLE public.chats TO authenticated;

GRANT ALL ON TABLE public.chats TO postgres;

GRANT ALL ON TABLE public.chats TO service_role;