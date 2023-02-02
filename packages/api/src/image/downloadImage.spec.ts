import {readFileSync} from 'fs';
import path from 'path';
import * as os from "os";
import nock from 'nock'
import {getMockReq, getMockRes} from "@jest-mock/express";
import {NextFunction, Request, Response} from "express";
import {FileStreamCache} from "@/cache/FileStreamCache";
import {downloadImage} from "@/image/downloadImage";
import {matchStream} from "../../fixtures/streamHelper";

describe("downloadImage", () => {
    let req: Request, res: Response, next: NextFunction;
    const fileStreamCache = new FileStreamCache(path.resolve(os.tmpdir(), "test"));
    const fixtureFilePath = `${__dirname}/../../fixtures/fixture.jpg`;

    beforeEach(() => {
        fileStreamCache.clearCache();
        req = getMockReq();
        ({res, next} = getMockRes());
        jest.clearAllMocks();
    });

    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
        fileStreamCache.clearCache();
    });

    it('Should download an image', async () => {
        const domain = "https://www.domain.com";
        const imageUrl = "/image.jpg";

        nock(domain).get(imageUrl).reply(200, readFileSync(fixtureFilePath));
        res.locals.imageEdits = {url : `${domain}${imageUrl}`};

        await downloadImage()(req, res, next);
        return matchStream(res.locals.imageSourceStream, fixtureFilePath);
    });

    it('Should call next middleware after downloading an image', async () => {
        const domain = "https://www.domain.com";
        const imageUrl = "/image.jpg";

        nock(domain).get(imageUrl).reply(200, readFileSync(fixtureFilePath));
        res.locals.imageEdits = {url : `${domain}${imageUrl}`};

        await downloadImage()(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('Should download an image with a 30X redirect', async () => {
        const domain = "https://www.domain.com";
        const imageUrl = "/image.jpg";
        const redirectImageUrl = "/new-image.jpg";

        nock(domain).get(imageUrl).reply(301, undefined, {Location : `${domain}${redirectImageUrl}`});
        nock(domain).get(redirectImageUrl).reply(200, readFileSync(fixtureFilePath));

        res.locals.imageEdits = {url : `${domain}${imageUrl}`};

        await downloadImage()(req, res, next);
        return matchStream(res.locals.imageSourceStream, fixtureFilePath);
    });

    it('Should call next middleware with an error if image does not exist', async () => {
        const domain = "https://www.domain.com";
        const imageUrl = "/image.jpg";

        nock(domain).get(imageUrl).reply(404)
        res.locals.imageEdits = {url: `${domain}${imageUrl}`};

        await downloadImage()(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('With a StreamCache, it should not download an image if it was already downloaded', async () => {
        const domain = "https://www.domain.com";
        const imageUrl = "/image.jpg";
        nock(domain).get(imageUrl).times(1).reply(200, readFileSync(fixtureFilePath))
        res.locals.imageEdits = {url : `${domain}${imageUrl}`};

        const downloadFile = async () => {
            await downloadImage(fileStreamCache)(req, res, next);
            await matchStream(res.locals.imageSourceStream, fixtureFilePath);
        }

        await downloadFile();
        await downloadFile();
    });
});