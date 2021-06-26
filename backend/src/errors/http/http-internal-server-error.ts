import { ErrorHandler } from "../error";

export class HttpInternalServerError extends ErrorHandler {
  constructor(message: string) {
    super(500, message);
  }
}
