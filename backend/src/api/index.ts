import express, { Router } from "express";
import { router as heroes } from "./heroes/index";
// import jwt from "express-jwt";
// import jwksRsa from "jwks-rsa";

export const router: Router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  res.status(200).json({ health: "API OK" });
  next();
});

  /*
// authentification
router.use(function timeLog(req, res, next) {

  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://<AUTH0_DOMAIN>/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: '<API_IDENTIFIER>',
    issuer: `https://<AUTH0_DOMAIN>/`,
    algorithms: ['RS256']
  });

  next();
});
  */

// define the home page route
router.use("/heroes", heroes);