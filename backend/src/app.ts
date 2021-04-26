import express from "express";
import helmet from "helmet";
import compression from "compression";
import { router as api } from "./api/index";

export const app = express();
export const staticPath: string = "static";

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: any, res: any, next: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  next();
});
app.use('/static', express.static(staticPath));
app.use("/api", api);
app.use("/healthcheck", (req: any, res: any, next: any) => {
  res.status(200).json({ health: "OK" });
  next();
})

app.use((req: any, res: any, next: any) => {
  res.send();
  console.log("réponse envoyée avec succès !");
});