import express, { Request, Response } from "express";
import { User } from "../models/user";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@gmmtickets/common";
import jwt from "jsonwebtoken";

const router = express.Router();
// The validation functions modify the req and res properties.
// The validationResult checks whether these properties are present on req/ res.
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in Use!");
    }
    const user = User.build({ email, password });
    await user.save();

    // Generate JSON Web Token as a string

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store this on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
