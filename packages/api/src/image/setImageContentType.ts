import {NextFunction, Request, Response } from "express";
import {ImageFormat} from "@/image/ImageEdits";

export function setImageContentType(req:Request, res:Response, next:NextFunction) {
    if (!res.locals.imageEdits) {
        throw new Error('Invalid image edits');
    }
    let contentType;
    switch (res.locals.imageEdits.format) {
        case ImageFormat.AVIF: {
            contentType='image/avif';
            break;
        }
        case ImageFormat.WEBP: {
            contentType='image/webp';
            break;
        }
        case ImageFormat.PNG: {
            contentType='image/png';
            break;
        }
        default : {
            contentType = 'image/jpeg';
        }
    }
    res.setHeader('Content-Type', contentType);
    next();
}
