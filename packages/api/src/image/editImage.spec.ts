import {createReadStream, createWriteStream} from 'fs';
import {getMockReq, getMockRes} from "@jest-mock/express";
import {NextFunction, Request, Response} from "express";
import * as editImageModule from './editImage';
import {ImageFormat} from "@/image/ImageEdits";
import {matchStream, getTmpFilePath} from "../../fixtures/streamHelper";

describe("editImage", () => {
    let req: Request, res: Response, next: NextFunction;
    const fixturePath = `${__dirname}/../../fixtures`;
    const fixtureFilePath = `${fixturePath}/fixture.jpg`;

    const testCases = [
        {
            title : `should edit image with avif format`,
            imageEdits : { format: ImageFormat.AVIF },
            expectedFile : `${fixturePath}/result.avif`,
        },
        {
            title : `should edit image with webp format`,
            imageEdits : { format: ImageFormat.WEBP },
            expectedFile : `${fixturePath}/result.webp`,
        },
        {
            title : `should edit image with jpg format`,
            imageEdits : { format: ImageFormat.JPG },
            expectedFile : `${fixturePath}/result.jpg`,
        },
        {
            title : `should edit image with jpeg format`,
            imageEdits : { format: ImageFormat.JPEG },
            expectedFile : `${fixturePath}/result.jpg`,
        },
        {
            title : `should edit image with webp format and flip=true`,
            imageEdits : {
                format: ImageFormat.WEBP,
                flip: true,
            },
            expectedFile : `${fixturePath}/result-flip.webp`,
        },
        {
            title : `should edit image with webp format and flop=true`,
            imageEdits : {
                format: ImageFormat.WEBP,
                flop: true,
            },
            expectedFile : `${fixturePath}/result-flop.webp`,
        },
        {
            title : `should edit image with png format and width=100 and height=100`,
            imageEdits : {
                format: ImageFormat.PNG,
                width: 100,
                height: 100,
            },
            expectedFile : `${fixturePath}/result-100-100.png`,
        },
        {
            title : `should edit image with webp format and width=100`,
            imageEdits : {
                format: ImageFormat.WEBP,
                width: 100,
            },
            expectedFile : `${fixturePath}/result-100.webp`,
        },
        {
            title : `should edit image with webp format and rotate=90`,
            imageEdits : {
                format: ImageFormat.WEBP,
                rotate: 90,
            },
            expectedFile : `${fixturePath}/result-rotate-90.webp`,
        },
    ];

    test.each(testCases)(`$title`,
        ({imageEdits, expectedFile}, done: any) => {
            const sourceStream = createReadStream(fixtureFilePath);
            const destFilePath = getTmpFilePath();
            const destStream = createWriteStream(destFilePath);

            destStream.on('finish', () => (
                matchStream(createReadStream(destFilePath), expectedFile).then(done).catch(done)
            ));

            destStream.on('error', (e) => done(e));

            // @ts-ignore
            editImageModule.editImageStream(sourceStream, destStream, imageEdits).catch(done);
        }
    );

    describe('editImage middleware function', () => {
        beforeEach(() => {
            req = getMockReq();
            ({res, next} = getMockRes());
            jest.clearAllMocks();

            // @ts-ignore
            jest.spyOn(editImageModule, 'editImageStream').mockImplementation(() => Promise.resolve());
        });

        it('should write edited images to http response', async () => {
            res.locals.imageSourceStream = "x";
            res.locals.imageEdits = {
                imageEdits: {format: ImageFormat.AVIF},
                expectedFile: `${fixturePath}/result.avif`,
            };

            await editImageModule.editImage(req, res, next);

            expect(editImageModule.editImageStream).toHaveBeenCalledWith(
                res.locals.imageSourceStream,
                res,
                res.locals.imageEdits
            );
        });
    });
});