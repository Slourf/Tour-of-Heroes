import express from "express";
import { router as heroes } from "./heroes/index";
export const router = express.Router();
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log("Time: ", Date.now());
    next();
});
// define the home page route
router.use("/heroes", heroes);
// define the about route
router.get("/about", (req, res) => {
    res.send("About birds");
});
//# sourceMappingURL=index.js.map