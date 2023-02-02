import { NextFunction, Request, Response } from "express";
import { getMockReq, getMockRes } from '@jest-mock/express'
import {ImageAuthorization} from "@/authorization/ImageAuthorization";
import {authorizeImageEdits} from "@/authorization/authorizeImageEdits";

describe("AuthorizeImageEdits", () => {
    let req : Request, res : Response, next: NextFunction;
    const imageAuthorization = new ImageAuthorization();

    beforeEach(() => {
        req = getMockReq();
        ({ res, next } = getMockRes());
        jest.clearAllMocks();
    });

    describe('when image request is not authorized', () => {
        beforeEach(() => {
            jest.spyOn(imageAuthorization, 'isAllowed').mockImplementation(() => false);
        });

        it("should return 403 status code", async () => {
            await authorizeImageEdits(imageAuthorization)(req, res, next);
            expect(res.status).toBeCalledWith(403);
        });

        it("should return error as json", async () => {
            await authorizeImageEdits(imageAuthorization)(req, res, next);
            expect(res.json).toBeCalledWith({error: "Unauthorized image transformation"});
        });

        it("should not call next middleware", async () => {
            await authorizeImageEdits(imageAuthorization)(req, res, next);
            expect(next).toBeCalledTimes(0);
        });
    });

    describe('when image request is authorized', () => {
        beforeEach(() => {
            jest.spyOn(imageAuthorization, 'isAllowed').mockImplementation(() => true);
        });

        it("should call next middleware to process image resizing", async () => {
            await authorizeImageEdits(imageAuthorization)(req, res, next);
            expect(next).toBeCalledTimes(1);
        });
    });
});