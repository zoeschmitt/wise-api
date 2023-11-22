import { CompleteRequest } from "../../_shared/models/requests.ts";
import { ErrorCodes, apiError } from "../../_shared/utils/errors.ts";
import { validate } from "../../_shared/utils/validate.ts";
import { ObjectSchema, object, string } from "yup";
import { CHATGPT_MODEL } from "../../_shared/utils/constants.ts";
import { hardcodedPrompt } from "./hardcodedPrompt.ts";
import { CORSResponse } from "../../_shared/utils/corsResponse.ts";
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

  try {
    const openaiRequest = {
      model: CHATGPT_MODEL,
      messages: openAiChats,
      temperature: 0,
    };

    const openAiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("OPENAI")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(openaiRequest),
      }
    );
    const completion = await openAiResponse.json();

    const parsedCompletion = {
      autocomplete: completion?.choices?.[0].message.content,
    };

    return new CORSResponse(parsedCompletion);
  } catch (error) {
    console.error("error:", error);
    return apiError(ErrorCodes.SERVER_ERROR);
  }
};

export const autocomplete = validate(handler, schema);
