import pkg from "pg";
import { dbInfo } from "../../helper";
import {
  Hero,
  HeroFileHeader,
  HeroFileless,
  HeroWithStats,
  HeroWithStatsRaw,
} from "./helper";
import fs from "fs";
import { ErrorHandler } from "../../error";

const { Client } = pkg;

export const getHeroesById = async (id: number) => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }

  try {
    const hero: Hero = (
      await client.query(
        "SELECT \
           heroes.id, heroes.name, heroes.description, heroes_image.path AS image, heroes_logo.path AS logo \
         FROM heroes \
         JOIN heroes_image \
           ON heroes.id = heroes_image.hero_id \
         JOIN heroes_logo \
           ON heroes.id = heroes_logo.hero_id \
         WHERE heroes.id = $1",
        [id]
      )
    ).rows[0];

    if (!hero) {
      throw new ErrorHandler(404, "Hero not found");
    }

    try {
      await fetchMissingImages(hero, client);
    } catch (err) {
      throw err;
    }

    client.end();
    return hero;
  } catch (err) {
    throw err;
  }
};

export const getHeroesWithStatsById = async (
  id: number
): Promise<HeroWithStats> => {
  const client: pkg.Client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }

  try {
    const hero: HeroWithStatsRaw = (
      await client.query(
        "SELECT \
          h.id, h.name, h.description, i.path AS image, l.path AS logo, \
          s.health, s.health_by_level, s.health_regen, s.health_regen_by_level, \
          s.ressource, s.ressource_by_level, s.ressource_regen, s.ressource_regen_by_level, \
          s.attack_damage, s.attack_damage_by_level, s.attack_speed, s.attack_speed_percentage_by_level, \
          s.ability_power, s.ability_power_by_level, s.armor, s.armor_by_level, \
          s.magic_resist, s.magic_resist_by_level, s.movement_speed, s.range \
        FROM heroes h \
        JOIN heroes_stats s \
          ON h.id = s.hero_id \
        JOIN heroes_image i \
          ON h.id = i.hero_id \
        JOIN heroes_logo l \
          ON h.id = l.hero_id \
        WHERE h.id = $1",
        [id]
      )
    ).rows[0];
    if (!hero) {
      throw new ErrorHandler(404, "Hero not found");
    }

    try {
      await fetchMissingImages(hero, client);
    } catch (err) {
      throw err;
    }

    client.end();
    return cleanHeroWithStats(hero);
  } catch (err) {
    throw err;
  }
};

export const getHeroes = async (request?: any, response?: any) => {
  const client = new Client(dbInfo);
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }
  try {
    const heroes: Hero[] = (
      await client.query(
        "SELECT \
           heroes.id, heroes.name, heroes.description, heroes_image.path AS image, heroes_logo.path AS logo \
         FROM heroes \
         JOIN heroes_image \
           ON heroes.id = heroes_image.hero_id \
         JOIN heroes_logo \
           ON heroes.id = heroes_logo.hero_id"
      )
    ).rows;

    try {
      await Promise.all(
        heroes.map(async (hero: Hero) => {
          try {
            await fetchMissingImages(hero, client);
          } catch (err) {
            throw err;
          }
        })
      );
    } catch (err) {
      throw err;
    }
    client.end();
    return heroes;
  } catch (err) {
    if (err) {
      throw err;
    }
  }
};

const fetchMissingImages = async (hero: Hero, client: pkg.Client) => {
  if (!fs.existsSync(hero.image)) {
    const image = (
      await client.query(
        "SELECT encode(data::bytea, 'hex') FROM heroes_image WHERE hero_id = $1",
        [hero.id]
      )
    ).rows[0];
    await fs.promises.writeFile(hero.image, image.encode, "hex");
  }

  if (!fs.existsSync(hero.logo)) {
    const logo = (
      await client.query(
        "SELECT encode(data::bytea, 'hex') FROM heroes_logo WHERE hero_id = $1",
        [hero.id]
      )
    ).rows[0];
    await fs.promises.writeFile(hero.logo, logo.encode, "hex");
  }
};

export const addHero = async (hero: HeroFileless, files: any) => {
  const client = new Client(dbInfo);
  const image: HeroFileHeader = files.image[0];
  const logo: HeroFileHeader = files.logo[0];

  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }

  try {
    const logoData: string = `\\x${await fs.promises.readFile(logo.path, {
      encoding: "hex",
    })}`;
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
    const imageData: string = `\\x${await fs.promises.readFile(image.path, {
      encoding: "hex",
    })}`;
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
  try {
    client.connect();
  } catch {
    throw new ErrorHandler(500, "Failed to connect to the database");
  }

  await client.query("DELETE FROM heroes WHERE id = $1", [id]);

  client.end();
};

const cleanHeroWithStats = (rawHero: HeroWithStatsRaw): HeroWithStats => {
  return {
    id: rawHero.id,
    name: rawHero.name,
    description: rawHero.description,
    image: rawHero.image,
    logo: rawHero.logo,
    stats: {
      health: rawHero.health,
      health_by_level: rawHero.health_by_level,
      health_regen: rawHero.health_regen,
      health_regen_by_level: rawHero.health_regen_by_level,
      ressource: rawHero.ressource,
      ressource_by_level: rawHero.ressource_by_level,
      ressource_regen: rawHero.ressource_regen,
      ressource_regen_by_level: rawHero.ressource_regen_by_level,
      attack_damage: rawHero.attack_damage,
      attack_damage_by_level: rawHero.attack_damage_by_level,
      attack_speed: rawHero.attack_speed,
      attack_speed_percentage_by_level:
        rawHero.attack_speed_percentage_by_level,
      ability_power: rawHero.ability_power,
      ability_power_by_level: rawHero.ability_power_by_level,
      armor: rawHero.armor,
      armor_by_level: rawHero.armor_by_level,
      magic_resist: rawHero.magic_resist,
      magic_resist_by_level: rawHero.magic_resist_by_level,
      movement_speed: rawHero.movement_speed,
      range: rawHero.range,
    },
  };
};
