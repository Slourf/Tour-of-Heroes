import { User } from "../helpers";

export interface UserWithProfile extends User {
  gender: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  phone_number: string;
}
