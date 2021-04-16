import pkg from "pg";
import { dbInfo } from "../../helper";
import { Hero, HeroFileHeader, HeroFileless } from "./helper";
import fs from "fs";
import { ErrorHandler } from "../../error";
import { staticPath } from "./../../app";

const { Client } = pkg;

export const getHeroesById = async (id: number) => {
  const client = new Client(dbInfo);
  client.connect();
  console.log("get");

  const hero: Hero = (
    await client.query("SELECT * FROM heroes WHERE id = $1", [id])
  ).rows[0];

  console.log(hero);
  if (!fs.existsSync(hero.image)) {
    // FIXME this code does not work !!
    const image = (
      await client.query("SELECT * FROM heroes_image WHERE image_path = $1", [
        hero.image
      ])
    ).rows[0];
    console.log(image);
    fs.writeFile(image.path, image.data, (err) => console.log(err));
  }

  if (!fs.existsSync(hero.logo)) {
    // FIXME this code does not work !!
    const logo = (
      await client.query("SELECT * FROM heroes_logo WHERE logo_path = $1", [
        hero.logo
      ])
    ).rows[0];
    fs.writeFile(logo.path, logo.data , (err) => console.log(err));
  }
  client.end();
  return hero;
};

export const getHeroes = async (request?: any, response?: any) => {
  const client = new Client(dbInfo);
  client.connect();

  const heroes: Hero[] = (await client.query("SELECT * FROM heroes")).rows;
  heroes.forEach(async (hero: Hero) => {
    if (!fs.existsSync(hero.image)) {
      console.log("get hero image");
      // FIXME this code does not work !!  WHERE image_path = '$1'
      const image = (
        await client.query("SELECT * FROM heroes_image", [hero.image])
      ).rows[0];
      console.log(image);
      fs.writeFile(image.path, image.data, image.encoding);
    }

    if (!fs.existsSync(hero.logo)) {
      // FIXME this code does not work !!
      const logo = (
        await client.query("SELECT * FROM heroes_logo WHERE logo_path = '$1'", [
          hero.logo,
        ])
      ).rows[0];
      fs.writeFile(logo.path, logo.data, logo.encoding);
    }
  });
  client.end();
  return heroes;
};

export const addHero = async (hero: HeroFileless, files: any) => {
  const client = new Client(dbInfo);
  const image: HeroFileHeader = files.image[0];
  const logo: HeroFileHeader = files.logo[0];

  client.connect();
  let logoData: string = "\\x";

  fs.readFile(logo.path, "hex", (err, data) => {
    logoData += data;
  });

  console.log(logo);

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
    ], (err, res) => {
        console.log('err',err,'pg writeResult', res);
    }
  );

  let imageData: string = "\\x";
  fs.readFile(image.path, "hex", (err, data) => {
    imageData += data;
  });

  console.log(image);

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

  console.log(hero);

  await client.query(
    "INSERT INTO heroes \
      (name, description, image, logo) \
      VALUES ($1, $2, $3, $4)",
    [hero.name, hero.description, image.path, logo.path]
  );
  console.log("hero created");

  client.end();
};

export const deleteHero = async (id: number) => {
  const client = new Client(dbInfo);
  client.connect();

  await client.query("DELETE FROM heroes WHERE id = $1", [id]);

  client.end();
};
