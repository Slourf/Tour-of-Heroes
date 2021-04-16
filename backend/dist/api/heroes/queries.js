var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pkg from "pg";
import { dbInfo } from "../../helper";
import fs from "fs";
const { Client } = pkg;
export const getHeroesById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    client.connect();
    console.log("get");
    const hero = (yield client.query("SELECT * FROM heroes WHERE id = $1", [id])).rows[0];
    console.log(hero);
    if (!fs.existsSync(hero.image)) {
        // FIXME this code does not work !!
        const image = (yield client.query("SELECT * FROM heroes_image WHERE image_path = $1", [
            hero.image
        ])).rows[0];
        console.log(image);
        fs.writeFile(image.path, image.data, (err) => console.log(err));
    }
    if (!fs.existsSync(hero.logo)) {
        // FIXME this code does not work !!
        const logo = (yield client.query("SELECT * FROM heroes_logo WHERE logo_path = $1", [
            hero.logo
        ])).rows[0];
        fs.writeFile(logo.path, logo.data, (err) => console.log(err));
    }
    client.end();
    return hero;
});
export const getHeroes = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    client.connect();
    const heroes = (yield client.query("SELECT * FROM heroes")).rows;
    heroes.forEach((hero) => __awaiter(void 0, void 0, void 0, function* () {
        if (!fs.existsSync(hero.image)) {
            console.log("get hero image");
            // FIXME this code does not work !!  WHERE image_path = '$1'
            const image = (yield client.query("SELECT * FROM heroes_image", [hero.image])).rows[0];
            console.log(image);
            fs.writeFile(image.path, image.data, image.encoding);
        }
        if (!fs.existsSync(hero.logo)) {
            // FIXME this code does not work !!
            const logo = (yield client.query("SELECT * FROM heroes_logo WHERE logo_path = '$1'", [
                hero.logo,
            ])).rows[0];
            fs.writeFile(logo.path, logo.data, logo.encoding);
        }
    }));
    client.end();
    return heroes;
});
export const addHero = (hero, files) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    const image = files.image[0];
    const logo = files.logo[0];
    client.connect();
    let logoData = "\\x";
    fs.readFile(logo.path, "hex", (err, data) => {
        logoData += data;
    });
    console.log(logo);
    yield client.query("INSERT INTO heroes_logo \
      (fieldname, originalname, encoding, mimetype, destination, filename, logo_path, size, data) \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
        logo.fieldname,
        logo.originalname,
        logo.encoding,
        logo.mimetype,
        logo.destination,
        logo.filename,
        logo.path,
        logo.size,
        logoData,
    ], (err, res) => {
        console.log('err', err, 'pg writeResult', res);
    });
    let imageData = "\\x";
    fs.readFile(image.path, "hex", (err, data) => {
        imageData += data;
    });
    console.log(image);
    yield client.query("INSERT INTO heroes_image \
      (fieldname, originalname, encoding, mimetype, destination, filename, image_path, size, data) \
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [
        image.fieldname,
        image.originalname,
        image.encoding,
        image.mimetype,
        image.destination,
        image.filename,
        image.path,
        image.size,
        imageData,
    ]);
    console.log(hero);
    yield client.query("INSERT INTO heroes \
      (name, description, image, logo) \
      VALUES ($1, $2, $3, $4)", [hero.name, hero.description, image.path, logo.path]);
    console.log("hero created");
    client.end();
});
export const deleteHero = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new Client(dbInfo);
    client.connect();
    yield client.query("DELETE FROM heroes WHERE id = $1", [id]);
    client.end();
});
//# sourceMappingURL=queries.js.map