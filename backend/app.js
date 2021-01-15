import express from 'express';
import helmet from 'helmet';
import compression from 'compression';

import bodyParse from 'body-parser';
import db from './api/heroes/queries';
import api from './api/index';

const app = express();

app.use(helmet());
app.use(compression());

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

export default app;