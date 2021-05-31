import { User } from "../helpers";

export interface UserWithProfile extends User {
  genre: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  phone_number: string;
}
