const express = require('express');
const { getHeroesById, getHeroes } = require('./queries');
const router = express.Router();

router.get('/', async (req, res, next) => {

    const heroes = await getHeroes();

    res.status(200).json(heroes);
  });

router.get('/:id', async (req, res, next) => {

    const id = parseInt(req.params.id)
    const hero = await getHeroesById(id);
    res.status(200).json(hero);
})

module.exports = router;