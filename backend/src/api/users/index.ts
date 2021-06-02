import express, { Router, Request, Response, NextFunction } from "express";
import { User, UserWithoutPassword, UserWithProfile } from "./helper";
import {
  getUsers,
  getUserById,
  addUser,
  deleteUser,
  isUsernameAvailable,
  getUserWithProfileById,
} from "./queries";
import multer from "multer";
import { ErrorHandler } from "../../error";

const upload = multer({ dest: "static/heroes/" });

export const router: Router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await getUsers();
  res.status(200).json(users);
  next();
});

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const user: User = req.body;
    try {
      await addUser(user);
      res.status(200);
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/profile/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;
    console.log("get: profile");

    try {
      const id = parseInt(idParam, 10);

      try {
        const profile: UserWithProfile = await getUserWithProfileById(id);

        console.log("profile:", profile);
        res.status(200).json(profile);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new ErrorHandler(500, "Failed to parse id"));
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
    next(new ErrorHandler(500, "Failed to parse id"));
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
      next(new ErrorHandler(500, "Failed to parse id"));
    }
  }
);
