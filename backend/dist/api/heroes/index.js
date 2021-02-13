var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { getHeroesById, getHeroes, addHero } from "./queries";
export const router = express.Router();
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const heroes = yield getHeroes();
    res.status(200).json(heroes);
}));
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    const hero = yield getHeroesById(id);
    res.status(200).json(hero);
}));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("post hero");
    console.log(req.body);
    const { name, description } = req.body;
    yield addHero(name, description);
    res.status(200);
}));
//# sourceMappingURL=index.js.map