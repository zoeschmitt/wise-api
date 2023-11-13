export class WiseError extends Error {
  constructor(message: string, public data: Record<string, any> = {}) {
    super(message);
  }
}
