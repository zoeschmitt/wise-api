export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// TODO do we want a preset of application/json? Or should we always set it manually?
export class CORSResponse extends Response {
  constructor(body?: any, init?: ResponseInit) {
    const defaultHeaders: { [key: string]: string } = {
      ...CORS_HEADERS,
    };
    const headers: { [key: string]: string } = {
      ...defaultHeaders,
      ...init?.headers,
    };
    !("Content-Type" in headers) &&
      headers["Content-Type"] === "application/json";

    super(body, { ...init, headers });
  }
}
