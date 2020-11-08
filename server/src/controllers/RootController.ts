import { Request, Response } from "express";
import { get, controller, use } from "./decorators";
import { auth } from "../middleware/auth";

@controller("")
class RootController {
    @get("/")
    getRoot(req: Request, res: Response) {
        if (req.session && req.session.loggedIn) {
            res.send(`
                <div>
                    <div>You are logged in</div>
                    <a href="/auth/logout">Logout</a>
                </div>
            `);
        } else {
            res.send(`
                <div>
                    <div>You are not logged in</div>
                    <a href="/auth/login">Login</a>
                </div>
            `);
        }
    }

    @get("/protected")
    @use(auth)
    getProtected(req: Request, res: Response) {
        res.send("Welcome to the protected route, logged in user!");
    }
}
