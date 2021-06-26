import { ErrorHandler } from "../error";

export class HttpNotFoundError extends ErrorHandler {
  constructor(message: string) {
    super(404, message);
  }
}
