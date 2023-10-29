import { serve } from "std/server";
import { ErrorCodes, apiError } from "../_shared/utils/errors.ts";
import { CORS_HEADERS } from "../_shared/utils/constants.ts";
import { RequestMethod } from "../_shared/models/requests.ts";
import { autocomplete } from "./autocomplete/index.ts";

serve(async (req: Request) => {
  const { method } = req;

  switch (method) {
    case RequestMethod.POST:
      return await autocomplete(req);
    case RequestMethod.OPTIONS:
      return new Response("ok", { headers: CORS_HEADERS });
    default:
      return apiError(ErrorCodes.NOT_FOUND, { error: "No request found." });
  }
});
