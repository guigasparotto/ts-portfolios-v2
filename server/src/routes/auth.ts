import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "config";

import User, { IUser } from "../models/User";

interface RequestWithBody extends Request {
    body: { [key: string]: string };
}

const authRouter = Router();

// @route   POST api/auth
// @desc    Authenticates user
// @access  Public
authRouter.post(
    "/",
    [
        check("email", "Invalid email format").isEmail(),
        check("password", "Password is required").exists(),
    ],
    async (req: RequestWithBody, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ msg: "Please verify your credentials and try again" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ msg: "Please verify your credentials and try again" });
            }

            // session property was added by cookie-session package
            // see server.ts configuration
            req.session = { loggedIn: true };

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 360000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                },
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error...");
        }
    },
);

authRouter.get("/logout", (req: Request, res: Response) => {
    req.session = null;
    res.redirect("/");
});

export { authRouter };
