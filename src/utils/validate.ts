import { AnyObject, ObjectSchema, ValidationError } from "yup";
import { Request, Response } from "express";
import { ErrorCodes, apiError } from "./errors";

export const validate =
  <T extends AnyObject>(
    handler: (req: Request, res: Response) => void,
    schema: ObjectSchema<T>
  ) =>
  async (req: Request, res: Response) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return handler(req, res);
    } catch (err) {
      console.log(err);
      if (err instanceof ValidationError) {
        apiError(res, ErrorCodes.BAD_REQUEST, { errors: err.errors });
      } else {
        console.error("Error occurred:", err);
        apiError(res, ErrorCodes.SERVER_ERROR);
      }
    }
  };
