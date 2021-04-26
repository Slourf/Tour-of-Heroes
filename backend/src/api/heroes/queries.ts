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
  client.end();
  return heroes;
};

const fetchMissingImages = async (hero: Hero, client: pkg.Client) => {
    if (!fs.existsSync(hero.image)) {
      const image = (
        await client.query("SELECT encode(data::bytea, 'hex') FROM heroes_image WHERE image_path = $1", [hero.image])
      ).rows[0];
      await fs.promises.writeFile(hero.image, image.encode, "hex");
    }

    if (!fs.existsSync(hero.logo)) {
      const logo = (
        await client.query("SELECT encode(data::bytea, 'hex') FROM heroes_logo WHERE logo_path = $1", [
          hero.logo,
        ])
      ).rows[0];
      await fs.promises.writeFile(hero.logo, logo.encode, "hex");
    }
}

export const addHero = async (hero: HeroFileless, files: any) => {
  const client = new Client(dbInfo);
  const image: HeroFileHeader = files.image[0];
  const logo: HeroFileHeader = files.logo[0];

  client.connect();


  try {
    const logoData: string = `\\x${await fs.promises.readFile(logo.path, { encoding: "hex" })}`;
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
  } catch (error) {
    throw error;
  }

  try {
      const imageData: string = `\\x${await fs.promises.readFile(image.path, { encoding: "hex" })}`;
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

  } catch (error) {
    throw error;
  }

  await client.query(
    "INSERT INTO heroes \
      (name, description, image, logo) \
      VALUES ($1, $2, $3, $4)",
    [hero.name, hero.description, image.path, logo.path]
  );

  client.end();
};

export const deleteHero = async (id: number) => {
  const client = new Client(dbInfo);
  client.connect();

  await client.query("DELETE FROM heroes WHERE id = $1", [id]);

  client.end();
};
