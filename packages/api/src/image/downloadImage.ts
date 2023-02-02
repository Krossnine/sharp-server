import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {NextFunction, Request, Response} from "express";
import {StreamCache} from "@/cache/StreamCache";
import logger from "@/logger";

function getAxiosInstance(streamCache?: StreamCache): AxiosInstance {
    const axiosInstance = axios.create();

    function saveToCache(response: any): AxiosResponse {
        // @ts-ignore
        response.data.pipe(streamCache.getWriteStream(response.data.responseUrl));
        return response;
    }

    function onRequestError(error: Error) {
        return Promise.reject(error);
    }

    function logRequestStart(config: any): AxiosRequestConfig {
        logger.debug(`Start downloading image : ${config.url}`)
        return config
    }

    function logRequestEnd(axiosRes: any): AxiosResponse {
        logger.debug(`Finish downloading image : ${axiosRes.data.responseUrl}`)
        return axiosRes;
    }

    axiosInstance.interceptors.request.use(logRequestStart, onRequestError);
    axiosInstance.interceptors.response.use(logRequestEnd, onRequestError);
    if (streamCache) {
        axiosInstance.interceptors.response.use(saveToCache, onRequestError);
    }
    return axiosInstance;
}

export function downloadImage(streamCache?: StreamCache) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const axiosInstance = getAxiosInstance(streamCache);
        const {url} = res.locals.imageEdits;
        const hasCache = streamCache && await streamCache.exists(url);

        if (hasCache) {
            res.locals.imageSourceStream = streamCache.getReaderStream(url);
            return next();
        }

        try {
            res.locals.imageSourceStream = await axiosInstance.get(url, {responseType: 'stream'})
                .then(imageResponse => imageResponse.data);
            next();
        } catch (e) {
            next(e)
        }

    }
}
