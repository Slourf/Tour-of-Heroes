import express from "express";
import helmet from "helmet";
import compression from "compression";
import bodyParse from "body-parser";
import { router as api } from "./api/index";
import { dbInfo } from "./helper";
export const app = express();
app.use(helmet());
app.use(compression());
app.use((req, res, next) => {
    console.log('Requete recue !');
    next();
});
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api', api);
app.use('/', (req, res) => {
    res.send(`user: ${dbInfo.user}, password: ${dbInfo.password} `);
});
app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});
//# sourceMappingURL=app.js.map