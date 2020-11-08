import { Request, Response } from "express";
import { get, controller, post, bodyValidator } from "./decorators";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

@controller("/api/users")
class UsersController {
    @get("/")
    async getUsers(req: Request, res: Response) {
        try {
            const users = await User.find({}).select("-password").sort({ date: -1 });
            res.json(users);
        } catch (err) {
            res.status(500).send("Server error");
        }
    }

    @post("/new")
    @bodyValidator("name", "email", "password")
    async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ msg: "Email already registered" });
            }

            user = new User({
                name,
                email,
                password,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
            res.send(err.message);
        }
    }
}
