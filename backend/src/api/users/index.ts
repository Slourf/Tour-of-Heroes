import express, { Router, Request, Response, NextFunction } from "express";
import { User } from "./helper";
import { getUsers, getUserById, addUser, deleteUser } from "./queries";
import multer from "multer";
import { ErrorHandler } from "../../error";

const upload = multer({ dest: "static/heroes/" });

export const router: Router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const users = await getUsers();
  res.status(200).json(users);
  next();
});
/*
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body;
  await addUser(user);

  res.status(200);
  next();
});
*/

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
