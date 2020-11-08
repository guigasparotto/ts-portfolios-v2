import "reflect-metadata";
import { Methods } from "./enums/Methods";
import { MetadataKeys } from "./enums/MetadataKeys";
import { RequestHandler } from "express";

/*  This interface extends PropertyDescriptor in order to define what it should receive, which in this case will be a request handler - so if a value exists, it must be this type. A request handler is a function with two parameters: request and response - (req: Request, res: Response) => {}
Not having this interface defined would allow any type to be accepted */

interface RouteHandlerDescriptor extends PropertyDescriptor {
    value?: RequestHandler;
}

function routeBinder(method: string) {
    return function (path: string) {
        return function (target: any, key: string, desc: RouteHandlerDescriptor) {
            Reflect.defineMetadata(MetadataKeys.Path, path, target, key);
            Reflect.defineMetadata(MetadataKeys.Method, method, target, key);
        };
    };
}

export const get = routeBinder(Methods.Get);
export const put = routeBinder(Methods.Put);
export const post = routeBinder(Methods.Post);
export const del = routeBinder(Methods.Del);
export const patch = routeBinder(Methods.Patch);
