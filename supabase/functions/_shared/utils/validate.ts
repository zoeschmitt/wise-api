import { AnyObject, ObjectSchema, ValidationError } from "yup";
import { ErrorCodes, apiError } from "./errors.ts";

export const validate =
  <T extends AnyObject>(
    handler: (req: Request) => Promise<Response>,
    schema: ObjectSchema<T>
  ) =>
  async (req: Request) => {
    try {
      const body = await req.json();
      await schema.validate(body);
      return handler(req);
    } catch (err) {
      console.log(err);
      return err instanceof ValidationError
        ? apiError(ErrorCodes.BAD_REQUEST, { errors: err.errors })
        : apiError(ErrorCodes.SERVER_ERROR);
    }
  };
