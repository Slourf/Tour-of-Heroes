import pkg from "pg";
import { dbInfo } from "../../helper";
import { Hero, HeroFileHeader, HeroFileless } from "./helper";
import fs from "fs";

const { Client } = pkg;

export const getHeroesById = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  client.connect();

  const hero: Hero = (
    await client.query("SELECT * FROM heroes WHERE id = $1", [id])
  ).rows[0];

  console.log(hero);
  await fetchMissingImages(hero, client);
  client.end();
  return hero;
};

export const getHeroes = async (request?: any, response?: any) => {
  const client = new Client(dbInfo);
  client.connect();

  const heroes: Hero[] = (await client.query("SELECT * FROM heroes")).rows;
  await Promise.all(heroes.map(async (hero: Hero) => {
    await fetchMissingImages(hero, client);
  }));
  console.log("Closing pg connection!");
  client.end();
  return heroes;
};

const fetchMissingImages = async (hero: Hero, client: pkg.Client) => {
    if (!fs.existsSync(hero.image)) {
      console.log("image: ", hero.image);
      const image = (
        await client.query("SELECT encode(data::bytea, 'hex') FROM heroes_image WHERE image_path = $1", [hero.image])
      ).rows[0];
      fs.writeFile(hero.image, image.encode, "hex", (err) => {
        console.log("image err: ", err, "writing image", hero.image)
        if (err)
          throw err;
      });
    }

    if (!fs.existsSync(hero.logo)) {
      console.log("logo: ", hero.image);
      const logo = (
        await client.query("SELECT encode(data::bytea, 'hex') FROM heroes_logo WHERE logo_path = $1", [
          hero.logo,
        ])
      ).rows[0];
      fs.writeFile(hero.logo, logo.encode, "hex", (err) => {
        console.log("logo err: ", err, "writing logo", hero.logo)
        if (err)
          throw err;
      });
    }
}

export const addHero = async (hero: HeroFileless, files: any) => {
  const client = new Client(dbInfo);
  const image: HeroFileHeader = files.image[0];
  const logo: HeroFileHeader = files.logo[0];

  client.connect();
  let logoData: string;

  fs.readFile(logo.path, "hex", async (errLogo, dataLogo) => {
    logoData = `\\x${dataLogo}`;
    if (errLogo)
      throw errLogo;

    await client.query(
      "INSERT INTO heroes_logo \
        (fieldname, originalname, encoding, mimetype, destination, filename, logo_path, size, data) \
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        logo.fieldname,
        logo.originalname,
        logo.encoding,
        logo.mimetype,
        logo.destination,
        logo.filename,
        logo.path,
        logo.size,
        logoData,
      ]
    );

    fs.readFile(image.path, "hex", async (errImage, dataImage) => {
      const imageData: string = `\\x${dataImage}`;
      if (errImage)
        throw errImage;

      await client.query(
        "INSERT INTO heroes_image \
          (fieldname, originalname, encoding, mimetype, destination, filename, image_path, size, data) \
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          image.fieldname,
          image.originalname,
          image.encoding,
          image.mimetype,
          image.destination,
          image.filename,
          image.path,
          image.size,
          imageData,
        ]
      );

      await client.query(
        "INSERT INTO heroes \
          (name, description, image, logo) \
          VALUES ($1, $2, $3, $4)",
        [hero.name, hero.description, image.path, logo.path]
      );
      client.end();
    });
  });
};

export const deleteHero = async (id: number) => {
  const client = new Client(dbInfo);
  client.connect();

  await client.query("DELETE FROM heroes WHERE id = $1", [id]);

  client.end();
};
