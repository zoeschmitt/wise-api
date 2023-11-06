import { serve } from "std/server";
import { ErrorCodes, apiError } from "../_shared/utils/errors.ts";
import { RequestMethod } from "../_shared/models/requests.ts";
import { getConversations } from "./get/index.ts";
import { CORSResponse } from "../_shared/utils/corsResponse.ts";

serve(async (req: Request) => {
  const { method } = req;

  switch (method) {
    case RequestMethod.GET:
      return await getConversations(req);
    case RequestMethod.OPTIONS:
      return new CORSResponse("ok");
    default:
      return apiError(ErrorCodes.NOT_FOUND, { error: "No request found." });
  }
});
