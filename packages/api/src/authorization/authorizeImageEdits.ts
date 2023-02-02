import { NextFunction, Request, Response } from 'express';
import {ImageAuthorization} from "./ImageAuthorization";


export function authorizeImageEdits(imageAuthorization: ImageAuthorization) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!imageAuthorization.isAllowed(res.locals.imageEdits)) {
            res.status(403).json({ error: "Unauthorized image transformation" });
            return;
        }
        next();
    };
}
