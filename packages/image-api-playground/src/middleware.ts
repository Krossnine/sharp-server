import express from 'express';
import type { Router } from 'express';
import {Request, Response} from "express";
import path from "path";

const mountPath = '/playground';

export function playgroundRouter() {
    const playgroundRouter: Router = express.Router();
    playgroundRouter.use(mountPath, (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../', req.originalUrl.replace(mountPath, '')));
    })
    return playgroundRouter;
}
