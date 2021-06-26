import express, { Router, Request, Response, NextFunction } from "express";
import { NewPasswordPayload, User, UserWithProfile } from "./helper";
import { router as profile } from "./profile/index";
import {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  isUsernameAvailable,
  updatePassword,
  getUserByIdWithPassword,
} from "./queries";
import { HttpInternalServerError } from "../../errors/http/http-internal-server-error";
import { HttpUnauthorizedError } from "../../errors/http/http-unauthorized-error";
import { verifyPassword } from "../auth";

export const router: Router = express.Router();

router.use("/profile", profile);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await getUsers();
  res.status(200).json(users);
  next();
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body;
  try {
    await addUser(user);
    res.status(200);
    next();
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/password",
  async (req: Request, res: Response, next: NextFunction) => {
    const passwords: NewPasswordPayload = req.body;
    passwords.user_id = req.params.id;

    try {
      const userId = parseInt(passwords.user_id, 10);

      const user: User = await getUserByIdWithPassword(userId);

      const combined: Buffer = Buffer.from(user.password, "base64");
      if (!verifyPassword(passwords.new_password, combined)) {
        throw new HttpUnauthorizedError("Bad password");
      }

      try {
        await updatePassword(passwords);
        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    try {
      const user = await getUserById(id);
      res.status(200).json(user);
      next();
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(new HttpInternalServerError("Failed to parse id"));
  }
});

router.get(
  "/exist/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isAvailable: boolean = await isUsernameAvailable(
        req.params.username
      );
      res.status(200).json(isAvailable);
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      try {
        await deleteUser(id);
        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
