export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
}
export class CompleteRequest {
  params?: any;
  body?: any;

  constructor(params?: any, body?: any) {
    this.params = params ?? {};
    this.body = body ?? {};
  }
}
