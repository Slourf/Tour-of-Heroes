import express, { Router, Request, Response, NextFunction } from "express";
import { User } from "./helper";
import { getUsers, getUserById, addUser, deleteUser } from "./queries";
import multer from "multer";
import { addHero } from "../heroes/queries";
import { HeroFileless } from "../heroes/helper";

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
    await addUser(user);

    res.status(200);
    next();
  }
);

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const user = await getUserById(id);
  res.status(200).json(user);
  next();
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);

    await deleteUser(id);

    res.status(200);
    next();
  }
);
