import "reflect-metadata";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { AppRouter } from "../../AppRouter";
import { Methods } from "./enums/Methods";
import { MetadataKeys } from "./enums/MetadataKeys";

function bodyChecker(keys: string): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.body) {
            res.status(422).send("Invalid request");
            return;
        }

        const errors: string[] = new Array();

        for (let key of keys) {
            let value = req.body[key];

            if (!value) {
                res.status(422).send(`Missing property ${key}`);
                return;
            }

            if (key === "password" && value.length < 6) {
                errors.push("Password must be at least 6 characters");
            }
        }

        if (!(errors === undefined || errors.length == 0)) {
            return res.status(400).json({ errors: errors });
        }

        next();
    };
}

export function controller(routePrefix: string): ClassDecorator {
    return function (target: Function): void {
        const router = AppRouter.getInstance();

        for (let key in target.prototype) {
            const routeHandler = target.prototype[key];
            const path = Reflect.getMetadata(MetadataKeys.Path, target.prototype, key);
            const method: Methods = Reflect.getMetadata(
                MetadataKeys.Method,
                target.prototype,
                key,
            );

            const middlewares =
                Reflect.getMetadata(MetadataKeys.Middleware, target.prototype, key) || [];

            const requiredBodyProps =
                Reflect.getMetadata(MetadataKeys.Validator, target.prototype, key) || [];

            const validator = bodyChecker(requiredBodyProps);

            if (path) {
                router[method](
                    `${routePrefix}${path}`,
                    ...middlewares,
                    validator,
                    routeHandler,
                );
            }
        }
    };
}
