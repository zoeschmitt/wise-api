import { CompleteRequest } from "../../_shared/models/requests.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CHATGPT_MODEL } from "../../_shared/utils/constants.ts";
import { hardcodedPrompt } from "./hardcodedPrompt.ts";
import { CORSResponse } from "../../_shared/utils/cors.ts";
import { CreateChatCompletionRequest, OpenAI } from "openai";
import { Role } from "../../_shared/models/conversations.ts";

interface Req {
  params: {
    userId?: string;
  };
  body: {
    content: string;
  };
}

const schema: ObjectSchema<Req> = object({
  params: object({
    userId: string(),
  }),
  body: object({
    content: string().required(),
  }),
});

const handler = async (req: CompleteRequest): Promise<Response> => {
  const { content } = req.body;

  const openAiChats = [];
  const autocompleteChat = hardcodedPrompt.concat(content);
  openAiChats.push({ role: Role.User, content: autocompleteChat });

  const openAiKey = Deno.env.get("OPENAI");
  // TODO sanitize autocompletes
  try {
    const openaiRequest: CreateChatCompletionRequest = {
      model: CHATGPT_MODEL,
      messages: openAiChats,
      temperature: 0,
      stream: true,
    };

    const openai = new OpenAI({ apiKey: openAiKey });

    const { response } = await openai.chat.completions.create(openaiRequest);

    const reader = response.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        const processChunks = async () => {
          const { done, value } = await reader.read();
          if (done) {
            console.log("Stream complete");
            return;
          }

          controller.enqueue(value);
          await processChunks();
        };
        await processChunks();
        controller.close();
      },
    });

    return new CORSResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  }
};

export const autocomplete = validate(handler, schema);
