import express, { Router } from "express";
import { router as heroes } from "./heroes/index";
import { router as users } from "./users/index";
import { router as auth } from "./auth/index";
// import jwt from "express-jwt";
// import jwksRsa from "jwks-rsa";

export const router: Router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});


// define the home page route
router.use("/auth", auth);
router.use("/users", users);
router.use("/heroes", heroes);