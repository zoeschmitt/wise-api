DROP TYPE IF EXISTS public.role_enum;

CREATE TYPE public.role_enum AS ENUM
    ('system', 'user', 'assistant');

ALTER TYPE public.role_enum
    OWNER TO postgres;