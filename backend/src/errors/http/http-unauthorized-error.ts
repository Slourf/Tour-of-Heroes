import { ErrorHandler } from "../error";

export class HttpUnauthorizedError extends ErrorHandler {
  constructor(message: string) {
    super(401, message);
  }
}
