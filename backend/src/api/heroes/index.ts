import express, { Router, Request, Response, NextFunction } from "express";
import { HeroFileless } from "./helper";
import {
  getHeroesById,
  getHeroes,
  addHero,
  deleteHero,
  getHeroesWithStatsById,
} from "./queries";
import multer from "multer";
import { ErrorHandler } from "../../error";
import { verifyToken } from "../auth";
import { UserWithoutPassword } from "../users/helper";

const upload = multer({ dest: "static/heroes/" });

export const router: Router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const heroes = await getHeroes();
    res.status(200).json(heroes);
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    try {
      const hero = await getHeroesById(id);
      res.status(200).json(hero);
      next();
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(new ErrorHandler(500, "Failed to parse id"));
  }
});

router.get(
  "/stats/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      try {
        const hero = await getHeroesWithStatsById(id);
        res.status(200).json(hero);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new ErrorHandler(500, "Failed to parse id"));
    }
  }
);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: UserWithoutPassword = verifyToken(req);
      if (!user.admin) {
        throw new ErrorHandler(403, "Not enough rights");
      }
    } catch (err) {
      next(err);
    }

    const files: any = req.files;
    const hero: HeroFileless = req.body;
    try {
      await addHero(hero, files);
      res.status(200);
      next();
    } catch (err) {
      next(err);
    }
    next();
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: UserWithoutPassword = verifyToken(req);
      if (!user.admin) {
        throw new ErrorHandler(403, "Not enough rights");
      }
    } catch (err) {
      next(err);
    }

    try {
      const id = parseInt(req.params.id, 10);
      try {
        await deleteHero(id);
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
