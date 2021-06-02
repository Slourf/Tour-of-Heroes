import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserWithoutPassword } from "../users/helper";

export interface RequestWithUser extends Request {
  user: UserWithoutPassword;
}

export const config = {
  secret: "secret",
};

export const authenticateJWT = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, config.secret, (err, user: any) => {
      if (err) {
        return res.status(401).json({ auth: false });
      }

      req.user = {
        id: user.sub,
        username: user.name,
        admin: user.admin,
      };
      next();
    });
  } else {
    res.status(401).json({ auth: false });
  }
};
