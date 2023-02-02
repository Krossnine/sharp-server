import {NextFunction, Request, Response } from "express";
import {ImageEdits} from "@/image/ImageEdits";

function getPlainImageEdits(req:Request) {
    const fullPath = req.baseUrl + req.path;
    if (fullPath.length > 1) {
        try {
            return JSON.parse(atob(fullPath.substring(1, fullPath.length)))
        } catch (e) {
            throw new Error(`Invalid image edits : ${fullPath}`);
        }
    } else {
        return req.query;
    }
}

export function parseImageEdits(req:Request, res:Response, next:NextFunction) {
    const imageOptions = getPlainImageEdits(req);
    return ImageEdits.fromPlainObject(imageOptions).then((imageEdits) => {
        res.locals.imageEdits = imageEdits;
        next();
    }).catch(next);
}