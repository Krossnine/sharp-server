import { NextFunction, Request, Response } from "express";
import { getMockReq, getMockRes } from '@jest-mock/express';
import logMiddleware from '@/logger/accessLogs';
import logger from "@/logger";

describe("Log Middleware", () => {
    let req : Request, res : Response, next: NextFunction;

    beforeEach(() => {
        req = getMockReq({
            method: 'GET',
            url : '/image?q1=a'
        });
        ({ res, next } = getMockRes());
        jest.clearAllMocks();
    });

    it("should log access", () => {
        const loggerInfo = jest.spyOn(logger, 'info');
        logMiddleware(req, res, next);
        expect(loggerInfo).toBeCalledTimes(1);
        expect(loggerInfo).toBeCalledWith(`GET /image?q1=a`);
    });

    it("should call next middleware", () => {
        logMiddleware(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});