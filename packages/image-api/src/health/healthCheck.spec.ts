import { NextFunction, Request, Response } from "express";
import { getMockReq, getMockRes } from '@jest-mock/express'
import {healthCheck} from "@/health/healthCheck";

describe("Health Middleware", () => {
    let req : Request, res : Response, next: NextFunction;

    beforeEach(() => {
        req = getMockReq();
        ({ res, next } = getMockRes());
        jest.clearAllMocks();
    });

    it("should return 200 status code", () => {
        healthCheck(req, res);
        expect(res.status).toBeCalledWith(200);
    });

    it("should return error as json", () => {
        healthCheck(req, res);
        expect(res.json).toBeCalledWith({status: 200});
    });
});