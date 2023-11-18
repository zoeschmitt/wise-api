import { serve } from "std/server";
import { ErrorCodes, apiError } from "../_shared/utils/errors.ts";
import { RequestMethod } from "../_shared/models/requests.ts";
import { getConversation } from "./get/index.ts";
import { CORSResponse } from "../_shared/utils/corsResponse.ts";
import { postConversation } from "./post/index.ts";

serve(async (req: Request) => {
  const { method } = req;

  switch (method) {
    case RequestMethod.GET:
      return await getConversation(req);
    case RequestMethod.POST:
      return await postConversation(req);
    case RequestMethod.OPTIONS:
      return new CORSResponse("ok");
    default:
      return apiError(ErrorCodes.NOT_FOUND, { error: "No request found." });
  }
});
