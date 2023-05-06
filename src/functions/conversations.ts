import { Request, Response } from "@google-cloud/functions-framework";

const conversations = (req: Request, res: Response) => {
  console.log("Hello, World!");
  res.send("Hello, World!");
};

export default conversations;
