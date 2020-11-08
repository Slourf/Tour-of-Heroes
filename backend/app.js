const express = require('express');
const bodyParse = require('body-parser');
const db = require('./api/heroes/queries');
const api = require('./api/index');

const app = express();
app.use((req, res, next) => {
    console.log('Requete recue !');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api', api);

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app;