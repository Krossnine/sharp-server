import {NextFunction, Request, Response} from "express";
import {getMockReq, getMockRes} from '@jest-mock/express'
import {parseImageEdits} from "@/image/parseImageEdits";
import {ImageEdits} from "@/image/ImageEdits";

describe("parseImageEdits", () => {
    let req : Request, res : Response, next: NextFunction;
    const plainImageEdits = {
        url: 'https://www.domain.com/image.jpg',
        width: "100",
        height: "100",
        rotate: "90",
        flip: "true",
        flop: "true",
    };

    beforeEach(() => {
        req = getMockReq();
        ({ res, next } = getMockRes());
        jest.clearAllMocks();
    });

    it("should read image edits from encoded path parameter", async () => {
        const encodedPathParameter = btoa(JSON.stringify(plainImageEdits))
        req = getMockReq({baseUrl: `/${encodedPathParameter}`, path: ''});
        await parseImageEdits(req, res, next);
        const expectedImageEdits = await ImageEdits.fromPlainObject(plainImageEdits);
        expect(res.locals.imageEdits).toEqual(expectedImageEdits);
        expect(next).toBeCalledTimes(1);
    });

    it("should throw an error if image edits from encoded path parameter is invalid", () => {
        const invalidEncodedPath = '*#invalid';
        req = getMockReq({baseUrl: `/${invalidEncodedPath}`, path: ''});
        expect( () => parseImageEdits(req, res, next))
            .toThrow("Invalid image edits : /*#invalid");
    });

    it("should read image edits from query parameters", async () => {
        req = getMockReq({baseUrl: '', path: '', query: plainImageEdits});
        await parseImageEdits(req, res, next);
        const expectedImageEdits = await ImageEdits.fromPlainObject(plainImageEdits);
        expect(res.locals.imageEdits).toEqual(expectedImageEdits);
        expect(next).toBeCalledTimes(1);
    });

    it("should read image edits from encoded path parameter over query parameters", async () => {
        const optionsFromPathParameter = {url: 'https://www.domain.com/fromPathParameter.jpg'};
        const optionsFromQueryParam = {url: 'https://www.domain.com/fromQueryParam.jpg'};
        req = getMockReq({
            query: optionsFromQueryParam,
            baseUrl: `/${(btoa(JSON.stringify(optionsFromPathParameter)))}`,
            path: ''
        });
        await parseImageEdits(req, res, next);
        const expectedImageEdits = await ImageEdits.fromPlainObject(optionsFromPathParameter);
        expect(res.locals.imageEdits).toEqual(expectedImageEdits);
        expect(next).toBeCalledTimes(1);
    });
});