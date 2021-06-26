import express, { Router, Request, Response, NextFunction } from "express";
import { UserWithProfile } from "./../helper";
import { getUserWithProfileById } from "./../queries";
import { HttpInternalServerError } from "../../../errors/http/http-internal-server-error";
import {
  updateProfileBirthdate,
  updateProfileEmail,
  updateProfileFirstname,
  updateProfileGender,
  updateProfileLastname,
  updateProfilePhoneNumber,
  updateProfileUsername,
} from "./queries";
import { genders } from "./helper";
import moment from "moment";

export const router: Router = express.Router();

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const idParam: string = req.params.id;

  try {
    const id = parseInt(idParam, 10);

    try {
      const profile: UserWithProfile = await getUserWithProfileById(id);

      res.status(200).json(profile);
      next();
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(new HttpInternalServerError("Failed to parse id"));
  }
});

router.post(
  "/:id/firstname",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const firstname = req.body.firstname;
        console.log(firstname);
        await updateProfileFirstname(id, firstname);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
router.post(
  "/:id/lastname",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const lastname = req.body.lastname;
        await updateProfileLastname(id, lastname);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
router.post(
  "/:id/email",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const email = req.body.email;
        await updateProfileEmail(id, email);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
router.post(
  "/:id/phone_number",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const phoneNumber = req.body.phone_number;
        await updateProfilePhoneNumber(id, phoneNumber);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
router.post(
  "/:id/gender",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const gender = req.body.gender;
        if (!genders.includes(gender)) {
          throw new HttpInternalServerError("Invalid gender");
        }
        await updateProfileGender(id, gender);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
router.post(
  "/:id/birthdate",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const birthdate: string = req.body.birthdate;

        const dateMomentObject = moment(birthdate, "DD/MM/YYYY");
        const dateObject = dateMomentObject.toDate();
        await updateProfileBirthdate(id, dateObject);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);

router.post(
  "/:id/username",
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam: string = req.params.id;

    try {
      const id = parseInt(idParam, 10);

      try {
        const username = req.body.username;
        await updateProfileUsername(id, username);

        res.status(200);
        next();
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(new HttpInternalServerError("Failed to parse id"));
    }
  }
);
