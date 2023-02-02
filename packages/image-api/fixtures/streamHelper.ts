import {createReadStream, readFileSync, writeFileSync, createWriteStream, ReadStream, existsSync, remove} from "fs-extra";
import * as os from "os";
import { Readable } from 'stream';
import streamEqual from 'stream-equal';
import path from "path";

export function getTmpFilePath() : string {
    return path.resolve(os.tmpdir(), new Date().toISOString());
}

export async function matchFixture(buffer: Buffer, fixtureFilePath: string): Promise<void> {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    await matchStream(stream as ReadStream, fixtureFilePath);
}

export function matchStream(readableStream: ReadStream, fixtureFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!readableStream) reject('expectStream : undefined readableStream');
        if (!existsSync(fixtureFilePath)) { /* create fixture (like jest snapshot) */
            const fixtureFileStream = createWriteStream(fixtureFilePath)
            readableStream.pipe(fixtureFileStream);
            fixtureFileStream.on('finish', () => {
                resolve();
            });
            fixtureFileStream.on('error', () => {
                throw new Error(`Could not save fixture ${fixtureFilePath}`);
            });
        } else {
            const fixtureReadStream = createReadStream(fixtureFilePath);
            return streamEqual(readableStream, fixtureReadStream).then((x) => {
                expect(x).toBeTruthy()
                resolve();
            });
        }
    });
}