import config from "config";
import { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction): void {
    // const token = req.header("x-auth-token");

    if (req.session && req.session.loggedIn) {
        next();
        return;
    }

    res.status(403);
    res.send("Not permitted");
}
