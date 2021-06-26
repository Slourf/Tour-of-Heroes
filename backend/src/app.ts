import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { router as api } from "./api/index";
import { ErrorHandler } from "./errors/error";

export const app = express();
export const staticPath: string = "static";

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  next();
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
  })
);

app.use("/static", express.static(staticPath));
app.use("/api", api);
app.use("/healthcheck", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ health: "OK" });
  next();
});

app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
    next();
  }
);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("réponse envoyée avec succès !!");
});
