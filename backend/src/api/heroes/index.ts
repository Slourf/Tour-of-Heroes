import express, { Router } from "express";
import { getHeroesById, getHeroes, addHero } from "./queries";

export const router: Router = express.Router();

router.get('/', async (req, res, next) => {

    const heroes = await getHeroes();

    res.status(200).json(heroes);
  });

router.get('/:id', async (req, res, next) => {

    const id = parseInt(req.params.id, 10);
    const hero = await getHeroesById(id);
    res.status(200).json(hero);
})

router.post('/', async (req, res, next) => {
  console.log("post hero");
  console.log(req.body);
  const { name, description } = req.body;
  await addHero(name, description);
  res.status(200)
})