import { Router, Response, Request } from "express";
import { check, validationResult } from "express-validator";
import config from "config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { auth } from "../middleware/auth";
import User from "../models/User";

const userRouter = Router();

// @route   GET api/users
// @desc    Get all the users
// @access  Private
userRouter.get("/", auth, async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select("-password").sort({ date: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// @route   POST api/users/
// @desc    Create a new user
// @access  Private
userRouter.post(
    "/",
    [
        check("name", "Please enter your name").not().isEmpty(),
        check("email", "Please enter a valid email address").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({
            min: 6,
        }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
            res.send(err.message);
        }
    },
);

export { userRouter };
