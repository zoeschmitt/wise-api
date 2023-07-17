import { serve } from "std/server";
import { ErrorCodes, apiError } from "../_shared/utils/errors.ts";
import { CORS_HEADERS } from "../_shared/utils/constants.ts";
import { RequestMethod } from "../_shared/models/requests.ts";
import { getConversation } from "./get/index.ts";

serve(async (req: Request) => {
  const { method } = req;

  switch (method) {
    case RequestMethod.GET:
      return await getConversation(req);
    case RequestMethod.OPTIONS:
      return new Response("ok", { headers: CORS_HEADERS });
    default:
      return apiError(ErrorCodes.NOT_FOUND, { error: "No request found." });
  }
});
