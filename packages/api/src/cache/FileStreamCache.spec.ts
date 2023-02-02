import * as os from "os";
import path from "path";
import * as fsExtra from "fs-extra";
import {FileStreamCache} from "./FileStreamCache";
import {ReadStream, WriteStream} from "fs";
import {getHash} from "./Hash";

function bufferToStream(stream: WriteStream, buffer:Buffer) {
    return new Promise((resolve, reject) => {
        stream.write(buffer);
        stream.close();
        stream.on('finish', () => resolve({}));
        stream.on('error', reject);
    });
}

async function streamToBuffer(stream: ReadStream): Promise<Buffer> {
    return new Promise<Buffer> ((resolve, reject) => {
        const buffer = Array<any>();
        stream.on('data', chunk => buffer.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(buffer)));
        stream.on('error', reject);
    });
}

// TODO: check when cachePath is invalid => fallback to os.tmpdir()
// TODO : in FileStreamCache getInstance from config
// TODO: check if cacheFilePath exists too

describe("FileStreamCache", () => {
    const fileStreamCache = new FileStreamCache(path.resolve(os.tmpdir(), "test"));

    beforeAll(() => {
        fileStreamCache.clearCache();
    })

    afterEach(() => {
        fileStreamCache.clearCache();
    })

    it("should provide a writable file stream", async () => {
        const filename = "myFile.jpg";
        const fileWriteStream = fileStreamCache.getWriteStream(filename);

        await bufferToStream(fileWriteStream, Buffer.from([1, 2, 3]));
        expect(fileWriteStream).toBeInstanceOf(WriteStream);
    });

    it("exists should return true if file was previously cached", async () => {
        const filename = "myFile.jpg";
        const fileWriteStream = fileStreamCache.getWriteStream(filename)

        expect(await fileStreamCache.exists(filename)).toBe(false);
        await bufferToStream(fileWriteStream, Buffer.from([1, 2, 3]));
        expect(await fileStreamCache.exists(filename)).toBe(true);
    });

    it("exists should return false if file was not previously cached", async () => {
        expect(await fileStreamCache.exists("unknown.jpg")).toBe(false);
    });

    it("should provide a readable file stream on a cached file", async () => {
        const filename = "myFile.jpg";
        const fileData = Buffer.from([1, 2, 3]);
        const fileWriteStream = fileStreamCache.getWriteStream(filename)
        await bufferToStream(fileWriteStream, fileData);

        const fileReadStream = fileStreamCache.getReaderStream(filename);
        expect(fileReadStream).toBeInstanceOf(ReadStream);
        expect(await streamToBuffer(fileReadStream)).toEqual(fileData);
    });

    it("should save file into provided cache path", async () => {
        const filename = "myFile.jpg";
        const fileData = Buffer.from([1, 2, 3]);
        const fileWriteStream = fileStreamCache.getWriteStream(filename)
        await bufferToStream(fileWriteStream, fileData);

        const cachedFilePath = path.resolve(path.resolve(os.tmpdir(), "test"), getHash(filename) || '');
        expect(await fsExtra.pathExists(cachedFilePath)).toBe(true);
    });

    it("should set cache directory to default os temp directory when no cachePath is provided", async () => {
        const fileStreamCache = new FileStreamCache();
        expect(fileStreamCache.getCachePath()).toEqual(os.tmpdir());
    });
})
