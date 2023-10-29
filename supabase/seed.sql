INSERT INTO public.users (userid, name, email)
VALUES
    ('80c39e74-7767-44a4-b6cf-2b2baa040a71', 'Zoe', 'zoeschmitt@hotmail.com'),
    ('90c39e74-7767-44a4-b6cf-2b2baa040a71', 'Julian', 'tipler.julian@gmail.com'),

-- Insert sample conversations
INSERT INTO public.conversations (conversationid, userid, title)
VALUES
    ('0b0392c9-8981-4e44-9ec1-e1e9c0c7822a', '80c39e74-7767-44a4-b6cf-2b2baa040a71', 'Exploring the universe.'),
    ('10b573fc-b281-4a12-a512-48ae0661880c', '90c39e74-7767-44a4-b6cf-2b2baa040a71', 'Majestic creatures of the Animal kingdom.'),

-- Insert sample chats
INSERT INTO public.chats (conversationid, role, userid, content, prompttokens, completiontokens, openaimodel, openaiid, openaiobject)
VALUES
    ('0b0392c9-8981-4e44-9ec1-e1e9c0c7822a', 'user', '80c39e74-7767-44a4-b6cf-2b2baa040a71', 'Hello, how are you?', 10, 20, 'gpt-3.5-turbo', 'OpenAI_ID_1', 'Object_1'),
    ('0b0392c9-8981-4e44-9ec1-e1e9c0c7822a', 'assistant', NULL, 'I am doing well, thank you!', 10, 20, 'gpt-3.5-turbo', 'OpenAI_ID_2', 'Object_2'),
    ('10b573fc-b281-4a12-a512-48ae0661880c', 'user', '90c39e74-7767-44a4-b6cf-2b2baa040a71', 'Hello, how are you?', 10, 20, 'gpt-3.5-turbo', 'OpenAI_ID_1', 'Object_1'),
    ('10b573fc-b281-4a12-a512-48ae0661880c', 'assistant', NULL, 'I am doing well, thank you!', 10, 20, 'gpt-3.5-turbo', 'OpenAI_ID_2', 'Object_2'),