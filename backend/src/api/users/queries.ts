import pkg from "pg";
import crypto from "crypto";

import { dbInfo } from "../../helper";
import { User, config } from "./helper";

const { Client } = pkg;

export const getUsers = async () => {
  const client: pkg.Client = new Client(dbInfo);
  client.connect();

  const users: User[] = (await client.query("SELECT * FROM users")).rows;

  client.end();

  return users;
};

export const getUserById = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  client.connect();

  const user: User[] = (await client.query("SELECT * FROM users WHERE id = $1", [id])).rows;

  client.end();

  return user;
};

export const getUserByUsername = async (username: string) => {
  const client: pkg.Client = new Client(dbInfo);
  client.connect();

  const user : User = (
    await client.query("SELECT * FROM users WHERE username = $1", [username])
  ).rows[0];

  client.end();

  return user;
};

export const addUser = async (user: User) => {
  const client: pkg.Client = new Client(dbInfo);
  client.connect();

  const salt: Buffer = crypto.randomBytes(config.saltBytes);

  const hash: Buffer = crypto.pbkdf2Sync(
    user.password,
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

  try {
    console.log(combined.toString('base64'));
      await client.query(
      "INSERT INTO users \
          (username, password) \
          VALUES ($1, $2)",
      [user.username, combined.toString('base64')]
      );
  } catch (error) {
      throw error;
  }

  client.end();
};

export const deleteUser = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  client.connect();
  await client.query("DELETE FROM users WHERE id = $1", [id]);
  client.end();
};
