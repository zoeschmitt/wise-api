import { CORS_HEADERS } from "./constants.ts";

export class CORSResponse extends Response {
  constructor(body?: any, init?: ResponseInit) {
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    };
    const headers = { ...defaultHeaders, ...init?.headers };
    const responseBody = typeof body === "object" ? JSON.stringify(body) : body;
    super(responseBody, { ...init, headers });
  }
}
