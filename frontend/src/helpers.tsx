// const { SERVER_PROTOCOL, SERVER_URL, SERVER_PORT } = process.env;
import { environment } from "./environment"

export const heroesUrl = `${environment.SERVER_PROTOCOL}://${environment.SERVER_URL}:${environment.SERVER_PORT}/api/heroes`;