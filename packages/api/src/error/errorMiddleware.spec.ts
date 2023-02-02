import { NextFunction, Request, Response } from "express";
import { getMockReq, getMockRes } from '@jest-mock/express'
import {errorMiddleware} from "@/error/errorMiddleware";
import logger from "@/logger";

describe("Error Middleware", () => {
    let req : Request, res : Response, next: NextFunction;
    const error = new Error('Testing Error');

    beforeEach(() => {
        req = getMockReq();
        ({ res, next } = getMockRes());
        jest.clearAllMocks();
    });

    it("should return 500 status code", () => {
        errorMiddleware(error, req, res, next);
        expect(res.status).toBeCalledWith(500);
    });

    it("should return error as json", () => {
        errorMiddleware(error, req, res, next);
        expect(res.json).toBeCalledWith(error);
    });

    it("should log error", () => {
        const loggerError = jest.spyOn(logger, 'error');
        errorMiddleware(error, req, res, next);
        expect(loggerError).toBeCalledTimes(1);
        expect(loggerError).toBeCalledWith(error);
    });

    it("should not call next middleware", () => {
        errorMiddleware(error, req, res, next);
        expect(next).toBeCalledTimes(0);
    });
});