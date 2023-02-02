import {NextFunction, Request, Response } from "express"
import logger from "@/logger";

export function errorMiddleware(err: Error, req:Request, res:Response, next: NextFunction) {
    logger.error(err)
    res.status(500).json(err)
}