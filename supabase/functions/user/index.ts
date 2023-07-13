import { serve } from "std/server";
import { postUser } from "./post/index.ts";
import { ErrorCodes, apiError } from "../_shared/utils/errors.ts";
import { getUser } from "./get/index.ts";
import { CORS_HEADERS } from "../_shared/utils/constants.ts";
import { RequestMethod } from "../_shared/models/requests.ts";

serve(async (req: Request) => {
  const { method } = req;

  switch (method) {
    case RequestMethod.POST:
      return await postUser(req);
    case RequestMethod.GET:
      return await getUser(req);
    case RequestMethod.OPTIONS:
      return new Response("ok", { headers: CORS_HEADERS });
    default:
      return apiError(ErrorCodes.NOT_FOUND, { error: "No request found." });
  }
});
