import {createApp, getStreamCache, getImageAuthorization} from "./app";
import supertest from 'supertest';
import nock from 'nock'
import {ImageFormat} from "@/image/ImageEdits";
import {readFileSync} from "fs";
import config, {CacheEngine, getConfig} from '@/config';
import {FileStreamCache} from "./cache/FileStreamCache";
import {ImageAuthorization} from "./authorization/ImageAuthorization";
import {matchFixture} from "../fixtures/streamHelper";

describe('App', () => {
    afterEach(() => {
        nock.cleanAll();
        nock.enableNetConnect();
    });

    describe('Healthcheck', () => {
        it('GET /health should return 200 status code', () => {
            const request = supertest(createApp(config));
            return request.get('/health').expect(200, {
                status: 200
            });
        });
    });

    describe('Image Cache', () => {
        it('should not use cache', () => {
            const streamCache = getStreamCache({...getConfig(), CACHE_ENGINE : CacheEngine.NONE});
            expect(streamCache).toBeUndefined();
        });

        it('should use filesystem cache', () => {
            const streamCache = getStreamCache({...getConfig(), CACHE_ENGINE : CacheEngine.FILESYSTEM});
            expect(streamCache).toBeInstanceOf(FileStreamCache);
        });
    });

    describe('Image Authorization', () => {
        it('should use allowedUrlPatterns from config', () => {
            const allowedUrlPatterns = ["a", "b", "c"];
            const imageAuthorization = getImageAuthorization({...(getConfig()), ALLOWED_URL_PATTERNS : allowedUrlPatterns});
            expect(imageAuthorization).toBeInstanceOf(ImageAuthorization);
            expect(imageAuthorization.allowedUrlPatterns).toEqual([/a/,/b/,/c/]);
        });
    });

    describe('Edit image', () => {
        const fixturePath = `${__dirname}/../fixtures`;
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

        test.each(testCases)(`$title`, async ({imageEdits, expectedFile}) => {
            const request = supertest(createApp({...getConfig(), CACHE_ENGINE: CacheEngine.NONE}));
            const domain = "https://www.domain.com";
            const imageUrl = "/image.jpg";

            imageEdits = {...imageEdits, ...{url: `${domain}${imageUrl}`}};
            nock(domain).get(imageUrl).reply(200, readFileSync(fixtureFilePath));

            // @ts-ignore
            const editImageUrl = `/?${new URLSearchParams(imageEdits).toString()}`;
            const response = await request.get(editImageUrl).expect(200).responseType('stream');

            await matchFixture(response.body, expectedFile);
        });
    })
});