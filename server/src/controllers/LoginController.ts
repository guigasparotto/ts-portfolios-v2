import { NextFunction, Request, Response } from "express";
import { get, post, controller, bodyValidator } from "./decorators";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

import User, { IUser } from "../models/User";

@controller("/api")
class LoginController {
    @get("/login")
    getLogin(req: Request, res: Response): void {
        res.send(`
            <form method="POST">
                <div>
                    <label>Email</label>
                    <input name="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input name="password" type="password" />
                </div>
                <button>Submit</button>
            </form>
            `);
    }

    @post("/login")
    @bodyValidator("email", "password")
    async postLogin(req: Request, res: Response) {
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
                `${config.JWT_SECRET}`,
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
    }

    @get("/logout")
    getLogout(req: Request, res: Response) {
        req.session = null;
        res.redirect("/");
    }
}
