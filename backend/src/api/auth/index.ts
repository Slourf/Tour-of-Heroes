import express, { Request, Response, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getUserByUsernameWithPassword } from "../users/queries";
import { User } from "../users/helper";
import { config } from "./helper";
import { ErrorHandler } from "../../error";

export const router: Router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body);
    const user: User = await getUserByUsernameWithPassword(req.body.username);
    console.log(user);
    if (!user) {
      throw new ErrorHandler(404, "No user found.");
    }
    const combined: Buffer = Buffer.from(user.password, "base64");

    const isPasswordValid: boolean = verifyPassword(
      req.body.password,
      combined
    );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      res.status(401).send({ auth: false, token: null });
    }

    const payload = {
      sub: user.id,
      name: user.username,
      admin: user.admin,
      iat: Math.round(Date.now() / 1000),
    };

    try {
      const token: string = jwt.sign(payload, config.secret, {
        expiresIn: 86400, // expires in 24 hours
        algorithm: "HS512",
      });
      res.status(200).json({ auth: true, token });
      next();
    } catch (err) {
      throw new ErrorHandler(500, "Failed to sign jwt token");
    }
  } catch (err) {
    next(err);
  }
});

const verifyPassword = (password: string, combined: Buffer) => {
  // extract the salt and hash from the combined buffer
  const saltBytes: number = combined.readUInt32BE(0);
  const hashBytes: number = combined.length - saltBytes - 8;
  const iterations: number = combined.readUInt32BE(4);
  const salt: Buffer = combined.slice(8, saltBytes + 8);
  const combinedHash: string = combined.toString("base64", saltBytes + 8);

  // verify the salt and hash against the password
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, iterations, hashBytes, "sha512")
    .toString("base64");

  return passwordHash === combinedHash;
};
