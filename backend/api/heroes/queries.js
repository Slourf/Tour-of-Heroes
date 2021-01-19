const { Client } = require('pg');
const { db_info } = require('./../../helper');

const getHeroesById = async (id) => {

  const client = new Client(db_info);
  client.connect();
  const resp = (await client.query(`SELECT * FROM heroes WHERE id = ${id}`)).rows[0];
  client.end();
  return resp;
}

const getHeroes = async (request, response) => {
  const client = new Client(db_info);
  client.connect();
  const resp = (await client.query('SELECT * FROM heroes')).rows;
  client.end();
  return resp;
}

module.exports = {
  getHeroes,
  getHeroesById
}