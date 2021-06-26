import pkg from "pg";

import { dbInfo } from "../../helper";
import {
  User,
  UserWithProfile,
  hashPassword,
  NewPasswordPayload,
} from "./helper";
import { HttpInternalServerError } from "../../errors/http/http-internal-server-error";
import { HttpNotFoundError } from "../../errors/http/http-not-found-error";

const { Client } = pkg;

export const getUsers = async () => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    const users: User[] = (await client.query("SELECT * FROM users")).rows;

    client.end();

    return users;
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const getUserWithProfileById = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    const user: UserWithProfile = (
      await client.query(
        "SELECT \
           users.id, users.username, users.admin, users_profile.gender, \
           users_profile.firstname, users_profile.lastname, users_profile.birthdate, \
           users_profile.phone_number, users_profile.email, users.password_length \
         FROM users \
         JOIN users_profile \
           ON users.id = users_profile.user_id \
         WHERE users.id = $1",
        [id]
      )
    ).rows[0];

    if (!user) {
      throw new HttpNotFoundError("User not found");
    }

    client.end();
    return user;
  } catch {
    throw new HttpNotFoundError("User not found");
  }
};

export const getUserById = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    const user: User = (
      await client.query(
        "SELECT id, username, admin FROM users WHERE id = $1",
        [id]
      )
    ).rows[0];

    if (!user) {
      throw new HttpNotFoundError("User not found");
    }

    client.end();

    return user;
  } catch {
    throw new HttpNotFoundError("User not found");
  }
};

export const getUserByUsername = async (username: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }

  try {
    const user: User = (
      await client.query("SELECT id, username FROM users WHERE username = $1", [
        username,
      ])
    ).rows[0];

    client.end();

    return user;
  } catch {
    throw new HttpNotFoundError("User not found");
  }
};

export const isUsernameAvailable = async (username: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }

  try {
    const results = (
      await client.query("SELECT 1 FROM users WHERE username = $1", [username])
    ).rows.length;

    client.end();

    return results === 0;
  } catch {
    throw new HttpNotFoundError("User not found");
  }
};

export const getUserByUsernameWithPassword = async (username: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }

  try {
    // FIXEME specify the fields selected
    const user: User = (
      await client.query("SELECT * FROM users WHERE username = $1", [username])
    ).rows[0];

    client.end();

    return user;
  } catch {
    throw new HttpNotFoundError("User not found");
  }
};

export const getUserByIdWithPassword = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }

  try {
    // FIXEME specify the fields selected
    const user: User = (
      await client.query("SELECT * FROM users WHERE id = $1", [id])
    ).rows[0];

    client.end();

    return user;
  } catch {
    throw new HttpNotFoundError("User not found");
  }
};

export const addUser = async (user: User) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }

  const combined: Buffer = hashPassword(user.password);

  try {
    await client.query(
      "INSERT INTO users \
          (username, password, password_lenght) \
          VALUES ($1, $2, $2)",
      [user.username, combined.toString("base64"), user.password.length]
    );
  } catch {
    throw new HttpInternalServerError("User creation failed");
  }

  client.end();
};

export const updatePassword = async (p: NewPasswordPayload) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    const combined: Buffer = hashPassword(p.new_password);
    await client.query(
      "UPDATE users \
            SET password TO $1 \
         WHERE id = $2",
      [combined, p.user_id]
    );
  } catch {
    throw new HttpInternalServerError("Update password failed");
  }
};

export const deleteUser = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query("DELETE FROM users WHERE id = $1", [id]);
  } catch {
    throw new HttpNotFoundError("User not found");
  }
  client.end();
};
