import crypto from "crypto";

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
  email: string;
  password_length: number;
}

export interface NewPasswordPayload {
  user_id: string;
  current_password: string;
  new_password: string;
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

export const hashPassword = (password: string) => {
  const salt: Buffer = crypto.randomBytes(config.saltBytes);

  const hash: Buffer = crypto.pbkdf2Sync(
    password,
    salt,
    config.iterations,
    config.hashBytes,
    "sha512"
  );

  const combined: Buffer = new Buffer(hash.length + salt.length + 8);

  // include the size of the salt so that we can, during verification,
  // figure out how much of the hash is salt
  combined.writeUInt32BE(salt.length, 0);
  // similarly, include the iteration count
  combined.writeUInt32BE(config.iterations, 4);

  salt.copy(combined, 8);
  hash.copy(combined, salt.length + 8);

  return combined;
};
