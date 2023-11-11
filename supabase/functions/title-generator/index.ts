import { serve } from "std/server";
import { RequestMethod } from "../_shared/models/requests.ts";
import { CORSResponse } from "../_shared/utils/corsResponse.ts";
import { apiError, ErrorCodes } from "../_shared/utils/errors.ts";
import { postTitle } from "./post/index.ts";

serve(async (req: Request) => {
  const { method } = req;

  switch (method) {
    case RequestMethod.POST:
      return await postTitle(req);
    case RequestMethod.OPTIONS:
      return new CORSResponse("ok");
    default:
      return apiError(ErrorCodes.NOT_FOUND, { error: "No request found." });
  }
});
