import { AnyObject, ObjectSchema, ValidationError } from "yup";
import { ErrorCodes, apiError } from "./errors.ts";
import { RequestMethod } from "../models/requests.ts";

class CompleteRequest {
  params?: Record<string, any>;
  body?: Record<string, any>;

  constructor(params?: Record<string, any>, body?: Record<string, any>) {
    this.params = params ?? {};
    this.body = body ?? {};
  }
}

export const getRequestParams = (req: Request) =>
  Object.fromEntries([...new URL(req.url).searchParams]);

export const validate =
  <T extends AnyObject>(
    handler: (req: Request) => Promise<Response>,
    schema: ObjectSchema<T>
  ) =>
  async (req: Request) => {
    try {
      const { method } = req;
      const request = new CompleteRequest();

      request.params = getRequestParams(req)

      if (method !== RequestMethod.GET) {
        request.body = await req.json();
      }

      await schema.validate(request);

      return await handler(req);
    } catch (err) {
      console.log(err);
      return err instanceof ValidationError
        ? apiError(ErrorCodes.BAD_REQUEST, { errors: err.errors })
        : apiError(ErrorCodes.SERVER_ERROR);
    }
  };
