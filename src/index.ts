import { Request, Response } from "express";

import conversations from "./functions/conversations";

/**
 * Entry point into the Functions Framework.
 * @see https://github.com/GoogleCloudPlatform/functions-framework-nodejs
 */
exports.function = (req: Request, res: Response) => {
  const paths = {
    "/conversations": conversations,
    // Default route (at the end)
    "/": () => res.send(Object.keys(paths)),
  };
  // Find the first route that matches
  for (const [path, route] of Object.entries(paths)) {
    if (req.path.startsWith(path)) return route(req, res);
  }

  // CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.send("No path found");
};
