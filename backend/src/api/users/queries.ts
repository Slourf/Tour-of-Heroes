import pkg from "pg";
import crypto from "crypto";

import { dbInfo } from "../../helper";
import { User, config } from "./helper";
import { ErrorHandler } from "../../error";

const { Client } = pkg;

export const getUsers = async () => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }
  try {
    const users: User[] = (await client.query("SELECT * FROM users")).rows;

    client.end();

    return users;
  } catch {
    throw new ErrorHandler(404, "Users not found");
  }
};

export const getUserById = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }
  try {
    const user: User = (await client.query("SELECT id, username FROM users WHERE id = $1", [id])).rows[0];

    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }

    client.end();

    return user;

  } catch {
    console.log("err");
    throw new ErrorHandler(404, "User not found");
  }

};

export const getUserByUsername = async (username: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }

  try {
    const user : User = (
      await client.query("SELECT id, username FROM users WHERE username = $1", [username])
    ).rows[0];

    client.end();

    return user;
  } catch {
    throw new ErrorHandler(404, "User not found");
  }
};

export const addUser = async (user: User) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }

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
  } catch {
      throw new ErrorHandler(500, "User creation failed");
  }

  client.end();
};

export const deleteUser = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }
  try {
    await client.query("DELETE FROM users WHERE id = $1", [id]);
  } catch {
    throw new ErrorHandler(404, "User not found")
  }
  client.end();
};
