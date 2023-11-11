import { RequestMethod } from "../models/requests.ts";

type openAiRequestProps = {
  url: string;
  type: RequestMethod;
  body: string;
};

export const openAiRequest = (props: openAiRequestProps): Promise<Response> => {
  const { url, type, body } = props;
  
  return fetch(url, {
    method: type,
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI")}`,
      "Content-Type": "application/json",
    },
    body,
  });
};
