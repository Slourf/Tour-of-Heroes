import express from "express";
import helmet from "helmet";
import compression from "compression";
import bodyParse from "body-parser";
import { router as api } from "./api/index";

export const app = express();
export const staticPath: string = "static";

app.use(helmet());
app.use(compression());

app.use((req: any, res: any, next: any) => {
  console.log("Requete recue !");
  next();
});

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

app.use((req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use('/static', express.static(staticPath));
app.use("/api", api);
/*ù
app.use("/", (req: any, res: any) => {
  res.send(`The server is running !`);
});
*/

app.use((req: any, res: any, next: any) => {
  console.log("Réponse envoyée avec succès !");
});
