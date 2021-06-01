export interface User {
  id: string;
  username: string;
  password: string;
  admin: boolean;
}
export interface UserWithoutPassword {
  id: string;
  username: string;
  admin: boolean;
}

export interface UserWithProfile extends User {
  gender: string;
  firstname: string;
  lastname: string;
  birthdate: Date;
  phone_number: string;
}

export const config = {
  // size of the generated hash
  hashBytes: 32,
  // larger salt means hashed passwords are more resistant to rainbow table, but
  // you get diminishing returns pretty fast
  saltBytes: 16,
  // more iterations means an attacker has to take longer to brute force an
  // individual password, so larger is better. however, larger also means longer
  // to hash the password. tune so that hashing the password takes about a
  // second
  iterations: 100000,
};
