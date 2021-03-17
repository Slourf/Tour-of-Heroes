import pkg from "pg";
import { dbInfo } from "../../helper";
import { Hero, HeroFileHeader, HeroFileless } from "./helper";
import fs from "fs";
import {  staticPath } from "./../../app";

const { Client } = pkg;

export const getHeroesById = async (id: number) => {
  const client = new Client(dbInfo);
  client.connect();
  console.log("get");
  const hero: Hero = (
    await client.query(`SELECT * FROM heroes WHERE id = $1`, [id])
  ).rows[0];
    console.log(hero);
  if (!fs.existsSync(`${hero.image}`)) {
    // FIXME this code does not work !!
    const image = (
      await client.query("SELECT * FROM heroes_image WHERE image_path = $1", [
        hero.image,
      ])
    ).rows[0];
    fs.writeFile(`${image.path}`, image.data, image.encoding);
  }

  if (!fs.existsSync(`${hero.logo}`)) {
    // FIXME this code does not work !!
    const logo = (
      await client.query("SELECT * FROM heroes_logo WHERE logo_path = $1", [
        hero.logo,
      ])
    ).rows[0];
    fs.writeFile(`${logo.path}`, logo.data, logo.encoding);
  }
  client.end();
  return hero;
};

export const getHeroes = async (request?: any, response?: any) => {
  const client = new Client(dbInfo);
  client.connect();
  const heroes: Hero[] = (await client.query("SELECT * FROM heroes")).rows;
  heroes.forEach(async (hero: Hero) => {

    if (!fs.existsSync(`${hero.image}`)) {
      // FIXME this code does not work !!
      const image = (
        await client.query("SELECT * FROM heroes_image WHERE image_path = $1", [
          hero.image,
        ])
      ).rows[0];
      fs.writeFile(`${image.path}`, image.data, image.encoding);
    }

    if (!fs.existsSync(`${hero.logo}`)) {
      // FIXME this code does not work !!
      const logo = (
        await client.query("SELECT * FROM heroes_logo WHERE logo_path = $1", [
          hero.logo,
        ])
      ).rows[0];
      fs.writeFile(`${logo.path}`, logo.data, logo.encoding);
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
  fs.readFile(logo.path, (err, data) => {
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
    ]
  );

  let imageData: string = "\\x";
  fs.readFile(image.path, (err, data) => {
    imageData += data;
  });

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
};
