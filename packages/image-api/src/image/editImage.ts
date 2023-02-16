import sharp from "sharp";
import {promisify} from 'util';
import stream from 'stream';
import {ImageFormat, ImageEdits} from "./ImageEdits";
import {NextFunction, Request, Response } from "express";
import { ReadStream, WriteStream } from "fs";
import * as editImageModule from './editImage'; // useful for unit test

function applyFormat(imageEdits: ImageEdits, sharpPipeline: any) {
    switch (imageEdits.format) {
        case ImageFormat.AVIF: {
            return sharpPipeline.avif({
                quality: imageEdits.quality
            });
        }
        case ImageFormat.WEBP: {
            return sharpPipeline.webp({
                quality: imageEdits.quality
            });
        }
        case ImageFormat.PNG: {
            return sharpPipeline.png();
        }
        case ImageFormat.JPEG:
        case ImageFormat.JPG:
        default : {
            sharpPipeline = sharpPipeline.jpeg({
                quality: imageEdits.quality
            });
            break;
        }
    }
    return sharpPipeline;
}

function applyResize(imageEdits: ImageEdits, sharpPipeline: any) {
    return sharpPipeline.resize({
        width: imageEdits.width,
        height: imageEdits.height,
        fit: imageEdits.fit || null,
        background: imageEdits.background ? '#' + imageEdits.background : null,
    });
}

function applyOperation(imageEdits: ImageEdits, sharpPipeline: any) {
    if (imageEdits.rotate) {
        sharpPipeline = sharpPipeline.rotate(imageEdits.rotate);
    }
    if (imageEdits.flip) {
        sharpPipeline = sharpPipeline.flip();
    }
    if (imageEdits.flop) {
        sharpPipeline = sharpPipeline.flop();
    }
    if (imageEdits.blur) {
        sharpPipeline = sharpPipeline.blur(10);
    }
    return sharpPipeline;
}

// @ts-ignore
export function editImageStream(imageSourceStream: ReadStream, writableStream: WriteStream, imageEdits: ImageEdits): Promise<any> {
    try {
        const pipeline = promisify(stream.pipeline);
        let sharpPipeline = sharp();
        sharpPipeline = applyResize(imageEdits, sharpPipeline);
        sharpPipeline = applyOperation(imageEdits, sharpPipeline);
        sharpPipeline = applyFormat(imageEdits, sharpPipeline);
        return pipeline(imageSourceStream, sharpPipeline, writableStream);
    }
    catch (e) {
        console.error(e);
    }
}

export async function editImage(req: Request, res: Response, next: NextFunction) {
    return editImageModule.editImageStream(
        res.locals.imageSourceStream,
        res as unknown as WriteStream,
        res.locals.imageEdits,
    ).then(next).catch(next);
}