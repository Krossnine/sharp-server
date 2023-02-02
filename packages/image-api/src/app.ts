import 'reflect-metadata';
import type {Express} from 'express';
import express from 'express';
import accessLogs from "@/logger/accessLogs";
import {errorMiddleware} from "@/error/errorMiddleware";
import {healthCheck} from "@/health/healthCheck";
import {parseImageEdits} from "@/image/parseImageEdits";
import {setImageContentType} from "@/image/setImageContentType";
import {downloadImage} from "@/image/downloadImage";
import {editImage} from "@/image/editImage";
import {authorizeImageEdits} from "@/authorization/authorizeImageEdits";
import {CacheEngine, IConfig} from "@/config";
import {ImageAuthorization} from "@/authorization/ImageAuthorization";
import {FileStreamCache} from "@/cache/FileStreamCache";
import {StreamCache} from "@/cache/StreamCache";

export function getStreamCache(config: IConfig): StreamCache | undefined {
    if (config.CACHE_ENGINE === CacheEngine.FILESYSTEM) {
        return new FileStreamCache(config.CACHE_FILESYSTEM_PATH);
    }
    return undefined;
}

export function getImageAuthorization(config: IConfig): ImageAuthorization {
    return new ImageAuthorization({
        allowedUrlPatterns: config.ALLOWED_URL_PATTERNS,
    });
}

export function createApp(config: IConfig): Express {
    const imageAuthorization = getImageAuthorization(config);
    const streamCache = getStreamCache(config);
    const app: Express = express();
    app.use(express.static('public'));
    app.use(accessLogs);
    app.get('/health', healthCheck);
    app.get('/*', authorizeImageEdits(imageAuthorization));
    app.get('/*', parseImageEdits);
    app.get('/*', downloadImage(streamCache));
    app.get('/*', setImageContentType);
    app.get('/*', editImage);
    app.use(errorMiddleware);
    return app;
}