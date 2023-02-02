import * as configModule from '@/config';
import {CacheEngine, LogLevel} from "@/config";

describe("Config", () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...env};
    });

    afterEach(() => {
        process.env = env;
    });

    it('should set port to 3000 by default', () => {
        delete process.env.PORT;
        const config = configModule.getConfig();
        expect(config.PORT).toEqual(3000);
    });

    it('should not allow PORT <1 from process.env', () => {
        process.env.PORT = '-666';
        expect(() => configModule.getConfig()).toThrow('Invalid port : -666');
    });

    it('should not allow PORT > 65536 from process.env', () => {
        process.env.PORT = '65537';
        expect(() => configModule.getConfig()).toThrow('Invalid port : 65537');
    });

    it('should set NODE_ENV to production by default', () => {
        delete process.env.NODE_ENV;
        const config = configModule.getConfig();
        expect(config.NODE_ENV).toEqual('production');
    });

    it('should set NODE_ENV from process.env', () => {
        process.env.NODE_ENV = 'development';
        const config = configModule.getConfig();
        expect(config.NODE_ENV).toEqual('development');
    });

    it('should set LOG_LEVEL to warn when no value is provided', () => {
        delete process.env.LOG_LEVEL;
        const config = configModule.getConfig();
        expect(config.LOG_LEVEL).toEqual(LogLevel.WARN);
    });

    it('should set LOG_LEVEL from process.env', () => {
        process.env.LOG_LEVEL = LogLevel.DEBUG;
        const config = configModule.getConfig();
        expect(config.LOG_LEVEL).toEqual(LogLevel.DEBUG);
    });

    it('should not allow invalid LOG_LEVEL from process.env', () => {
        process.env.LOG_LEVEL = 'unknownLevel';
        expect(() => configModule.getConfig()).toThrow('Invalid log level : unknownLevel');
    });

    it('should set CACHE_ENGINE to filesystem by default', () => {
        delete process.env.CACHE_ENGINE;
        const config = configModule.getConfig();
        expect(config.CACHE_ENGINE).toEqual(CacheEngine.FILESYSTEM);
    });

    it('should set CACHE_ENGINE from process.env', () => {
        process.env.CACHE_ENGINE = CacheEngine.NONE;
        const config = configModule.getConfig();
        expect(config.CACHE_ENGINE).toEqual(CacheEngine.NONE);
    });

    it('should not allow invalid CACHE_ENGINE from process.env', () => {
        process.env.CACHE_ENGINE = 'unknownCacheEngine';
        expect(() => configModule.getConfig()).toThrow('Invalid cache engine : unknownCacheEngine');
    });

    it('should set undefined CACHE_FILESYSTEM_PATH by default', () => {
        delete process.env.CACHE_FILESYSTEM_PATH;
        const config = configModule.getConfig();
        expect(config.CACHE_FILESYSTEM_PATH).toBeUndefined();
    });

    it('should set CACHE_FILESYSTEM_PATH from process.env', () => {
        process.env.CACHE_FILESYSTEM_PATH = '/tmp/test'
        const config = configModule.getConfig();
        expect(config.CACHE_FILESYSTEM_PATH).toEqual('/tmp/test');
    });

    it('should set ALLOWED_URL_PATTERNS to empty array by default', () => {
        delete process.env.ALLOWED_URL_PATTERNS;
        const config = configModule.getConfig();
        expect(config.ALLOWED_URL_PATTERNS).toEqual([]);
    });

    it('should set ALLOWED_URL_PATTERNS from process.env', () => {
        process.env.ALLOWED_URL_PATTERNS="a,pattern1,*pattern2";
        const config = configModule.getConfig();
        expect(config.ALLOWED_URL_PATTERNS).toEqual([
            "a",
            "pattern1",
            "*pattern2"
        ]);
    });
});