import {NextFunction, Request, Response} from "express";
import {getMockReq, getMockRes} from '@jest-mock/express'
import {ImageFormat, ImageEdits} from "@/image/ImageEdits";
import {setImageContentType} from "@/image/setImageContentType";

describe("setImageContentType", () => {
    let req : Request, res : Response, next: NextFunction;

    beforeEach(() => {
        req = getMockReq();
        ({ res, next } = getMockRes());
        jest.clearAllMocks();
    });

    test.each([
        {format: ImageFormat.AVIF, expectedContentType: 'image/avif'},
        {format: ImageFormat.PNG, expectedContentType: 'image/png'},
        {format: ImageFormat.WEBP, expectedContentType: 'image/webp'},
        {format: ImageFormat.JPG, expectedContentType: 'image/jpeg'},
        {format: ImageFormat.JPEG, expectedContentType: 'image/jpeg'},
    ])(`should set content-type $expectedContentType header for $format format`, ({format, expectedContentType}) => {
        res.locals.imageEdits = new ImageEdits({format});
        setImageContentType(req, res, next);
        expect(res.setHeader).toBeCalledWith('Content-Type', expectedContentType);
    });

    it("should throw an error if image edits is missing", () => {
        expect(() => setImageContentType(req, res, next)).toThrow('Invalid image edits');
    });

    it("should call next middleware", () => {
        res.locals.imageEdits = new ImageEdits({format : ImageFormat.AVIF});
        setImageContentType(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});