import express, { Router, Request, Response, NextFunction } from "express";
import { HeroFileless } from "./helper";
import { getHeroesById, getHeroes, addHero, deleteHero } from "./queries";
import multer from "multer";

const upload = multer({ dest: "static/heroes/" });

export const router: Router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const heroes = await getHeroes();
  console.log("get heroe");
  res.status(200).json(heroes);
  next();
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const hero = await getHeroesById(id);
  res.status(200).json(hero);
  next();
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
    await addHero(hero, files);

    res.status(200);
    next();
  }
);

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);

  await deleteHero(id);

  res.status(200);
  next();
});
