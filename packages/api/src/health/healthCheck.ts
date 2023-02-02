import {Request, Response} from "express";

export function healthCheck(req: Request, res: Response) {
    return res.status(200).json({status: 200});
}