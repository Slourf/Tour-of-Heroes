import { pathToFileURL } from "url";
import pkg from "pg";
import { dbInfo } from "../../helper";

const { Client } = pkg;

export const getHeroesById = async (id: number) => {

  const client = new Client(dbInfo);
  client.connect();
  const resp = (await client.query(`SELECT * FROM heroes WHERE id = ${id}`)).rows[0];
  client.end();
  return resp;
}

export const getHeroes = async (request?: any, response?: any) => {
  const client = new Client(dbInfo);
  client.connect();
  const resp = (await client.query('SELECT * FROM heroes')).rows;
  client.end();
  return resp;
}

export const addHero = async (name: string, description: string) => {
  const client = new Client(dbInfo);
  client.connect();
  await client.query(`INSERT INTO heroes (name) VALUES ('${name}')`);
  client.end();
}