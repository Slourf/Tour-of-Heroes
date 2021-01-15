
import { Router } from 'express'
import def from './queries'

const { getHeroesById, getHeroes } = def;
const router = Router();

router.get('/', async (req, res, next) => {

    const heroes = await getHeroes();

    res.status(200).json(heroes);
  });

router.get('/:id', async (req, res, next) => {

    const id = parseInt(req.params.id)
    const hero = await getHeroesById(id);
    res.status(200).json(hero);
})

export default router;