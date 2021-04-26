import express, { Request, Response, NextFunction, Router } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getUserByUsername } from "../users/queries";
import { User } from "../users/helper";
import { config } from "./helper";

export const router: Router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const user: User = (await getUserByUsername(req.body.username));
  if (!user) {
    return res.status(404).send('No user found.');
  }
  const combined: Buffer = Buffer.from(user.password, "base64");

  const isPasswordValid: boolean = verifyPassword(req.body.password, combined);
  console.log(isPasswordValid);
  if (!isPasswordValid) {
    return res.status(401).send({ auth: false, token: null });
  }

  const payload = {
    "sub": user.id,
    "name": user.username,
    "iat": Math.round(Date.now() / 1000)
  }

  const token: string = jwt.sign(payload, config.secret, {
    expiresIn: 86400, // expires in 24 hours
    algorithm: "HS512"
  });

  res.status(200).json({ auth: true, token });
  next();
})

const verifyPassword = (password: string, combined: Buffer) => {
  // extract the salt and hash from the combined buffer
  const saltBytes: number = combined.readUInt32BE(0);
  const hashBytes: number = combined.length - saltBytes - 8;
  const iterations: number = combined.readUInt32BE(4);
  const salt: Buffer = combined.slice(8, saltBytes + 8);
  const combinedHash: string = combined.toString('base64', saltBytes + 8);

  // verify the salt and hash against the password
  const passwordHash = crypto.pbkdf2Sync(password, salt, iterations, hashBytes, "sha512").toString('base64');

  return passwordHash === combinedHash;
}