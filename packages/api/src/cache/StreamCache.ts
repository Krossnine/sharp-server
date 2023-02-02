import {ReadStream, WriteStream} from 'fs';

export abstract class StreamCache {
    abstract exists(filename:string): Promise<boolean>;
    abstract getReaderStream(filename: string): ReadStream;
    abstract getWriteStream(filename: string): WriteStream;
    abstract clearCache(): void;
}
