import pkg from "pg";

import { dbInfo } from "../../../helper";
import { HttpInternalServerError } from "../../../errors/http/http-internal-server-error";
import { HttpNotFoundError } from "../../../errors/http/http-not-found-error";

const { Client } = pkg;

export const updateProfileFirstname = async (id: number, firstname: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query(
      "UPDATE users_profile SET firstname = $1 WHERE user_id = $2",
      [firstname, id]
    );

    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const updateProfileLastname = async (id: number, lastname: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query(
      "UPDATE users_profile SET lastname = $1 WHERE user_id = $2",
      [lastname, id]
    );

    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const updateProfileEmail = async (id: number, email: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query(
      "UPDATE users_profile SET email = $1 WHERE user_id = $2",
      [email, id]
    );
    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const updateProfilePhoneNumber = async (
  id: number,
  phoneNumber: string
) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }

  try {
    await client.query(
      "UPDATE users_profile SET phone_number = $1 WHERE user_id = $2",
      [phoneNumber, id]
    );
    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const updateProfileGender = async (id: number, gender: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query(
      "UPDATE users_profile SET gender = $1 WHERE user_id = $2",
      [gender, id]
    );

    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const updateProfileUsername = async (id: number, username: string) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query("UPDATE users SET username = $1 WHERE id = $2", [
      username,
      id,
    ]);

    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};

export const updateProfileBirthdate = async (id: number, birthdate: Date) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new HttpInternalServerError("Failed to connect to the database");
  }
  try {
    await client.query(
      "UPDATE users_profile SET birthdate = $1 WHERE id = $2",
      [birthdate, id]
    );

    client.end();
  } catch {
    throw new HttpNotFoundError("Users not found");
  }
};
