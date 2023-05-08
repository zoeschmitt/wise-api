import { Request, Response } from "@google-cloud/functions-framework";

export const conversations = (req: Request, res: Response) => {
  console.log("Hello, World!");
  res.send("Hello, World!");
};
