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
import { getHeroesById, getHeroes, addHero, deleteHero } from "./queries";
import multer from "multer";
const upload = multer({ dest: "static/heroes/" });
export const router = express.Router();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const heroes = yield getHeroes();
    res.status(200).json(heroes);
    next();
}));
router.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    const hero = yield getHeroesById(id);
    res.status(200).json(hero);
    next();
}));
router.post("/", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const hero = req.body;
    yield addHero(hero, files);
    res.status(200);
    next();
}));
router.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    yield deleteHero(id);
    res.status(200);
    next();
}));
//# sourceMappingURL=index.js.map