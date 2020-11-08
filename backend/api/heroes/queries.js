const Pool = require('pg').Pool

const pool = new Pool({
  user: 'toh',
  host: 'localhost',
  database: 'tower_of_heroes',
  password: 'password',
  port: 5432,
})

const getHeroesById = async (id) => {

  return (await pool.query(`SELECT * FROM heroes WHERE id = ${id}`)).rows[0];
}

const getHeroes = async (request, response) => {
  return (await pool.query('SELECT * FROM heroes')).rows;
}

module.exports = {
  getHeroes,
  getHeroesById
}