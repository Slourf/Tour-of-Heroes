import express, { Router, Request, Response, NextFunction } from "express";
import { HeroFileless } from "./helper";
import { getHeroesById, getHeroes, addHero, deleteHero } from "./queries";
import multer from "multer";
import { ErrorHandler } from "../../error";

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

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files;
    const hero: HeroFileless = req.body;
    try {
      await addHero(hero, files);
      res.status(200);
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
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
});
