// const { SERVER_PROTOCOL, SERVER_URL, SERVER_PORT } = process.env;
import { environment } from "./environment";

export const url = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}`;

export interface User {
  id: string;
  username: string;
  admin: boolean;
}
