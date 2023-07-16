import { AnyObject, ObjectSchema, ValidationError } from "yup";
import { ErrorCodes, apiError } from "./errors.ts";
import { CompleteRequest, RequestMethod } from "../models/requests.ts";

export const getRequestParams = (req: Request) =>
  Object.fromEntries([...new URL(req.url).searchParams]);

export const validate =
  <T extends AnyObject>(
    handler: (req: CompleteRequest) => Promise<Response>,
    schema: ObjectSchema<T>
  ) =>
  async (req: Request) => {

    try {
      const { method } = req;
      const request = new CompleteRequest();

      request.params = getRequestParams(req)

      if (method !== RequestMethod.GET && schema.fields.body) {
        request.body = await req.json();
      }

      await schema.validate(request);

      return await handler(request);
    } catch (err) {
      console.log(err);
      return err instanceof ValidationError
        ? apiError(ErrorCodes.BAD_REQUEST, { errors: err.errors })
        : apiError(ErrorCodes.SERVER_ERROR);
    }
  };
