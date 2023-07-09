import { serve } from "std/server";
import { postUser } from "./post/index.ts";
import { apiError } from "../_shared/utils/errors.ts";
import { getUser } from "./get/index.ts";
import { CORS_HEADERS } from "../_shared/utils/constants.ts";

enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
}

serve(async (req: Request) => {
  console.log(req);
  const { method } = req;

  switch (method) {
    case RequestMethod.POST:
      return await postUser(req);
    case RequestMethod.GET:
      return await getUser(req);
    case RequestMethod.OPTIONS:
      return new Response('ok', { headers: CORS_HEADERS })
    default:
      return apiError(400, { error: "No request found." });
  }
});