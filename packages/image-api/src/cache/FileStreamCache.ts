import * as os from "os";
import {StreamCache} from "./StreamCache";
import {createReadStream, createWriteStream, promises as pfs, ReadStream, WriteStream} from "fs";
import * as fsExtra from "fs-extra";
import logger from "@/logger";
import {getHash} from "./Hash";

export class FileStreamCache extends StreamCache {
    protected readonly cachePath: string;

    constructor(cachePath: string = os.tmpdir()) {
        super();
        this.cachePath = cachePath;
        fsExtra.ensureDir(cachePath);
    }

    private getFileCachePath(filename:string) {
        return `${this.cachePath}/${getHash(filename)}`
    }

    getCachePath() {
        return this.cachePath;
    }

    exists(filename: string): Promise<boolean> {
        logger.debug(`Check if file exists : ${this.getFileCachePath(filename)}`);
        return pfs.access(this.getFileCachePath(filename))
            .then(() => true)
            .catch(() => false);
    }

    getReaderStream(filename: string): ReadStream {
        return createReadStream(this.getFileCachePath(filename));
    }

    getWriteStream(filename: string): WriteStream {
        return createWriteStream(this.getFileCachePath(filename))
    }

    clearCache() {
        fsExtra.emptyDirSync(this.getCachePath());
    }
}