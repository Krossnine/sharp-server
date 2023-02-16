import {
    IsInt, IsPositive, IsOptional, IsBoolean, IsUrl, validate, IsEnum, IsString, IsHexColor, IsHSL
} from 'class-validator';

import {Type, plainToClass} from "class-transformer"

export enum ImageFormat {
    AVIF='avif',
    WEBP='webp',
    JPEG='jpeg',
    JPG='jpg',
    PNG='png',
}

export enum ResizeFit {
    COVER="cover",
    CONTAIN='contain',
    FILL='fill',
    INSIDE='inside',
    OUTSIDE='outside',
}

export class ImageEdits {
    @IsUrl()
    url: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    width?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    height?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    quality?: number;

    @IsEnum(ImageFormat, {message: () => `Allowed formats should be ${Object.values(ImageFormat).join(',')}`})
    @IsOptional()
    format?: string;

    @IsEnum(ResizeFit, {message: () => `Allowed resize fits should be ${Object.values(ResizeFit).join(',')}`})
    @IsOptional()
    fit?: string;

    @IsHexColor()
    @IsOptional()
    background:string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    rotate?: number;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    flip?: boolean;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    flop?: boolean;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    blur?: boolean;

    // TODO : efforts with default values (add configuration for default values)

    constructor(partial?: Partial<ImageEdits>) {
        return Object.assign(this, partial)
    }

    static fromPlainObject(x: any): Promise<ImageEdits> {
        // @ts-ignore
        const instance = plainToClass(ImageEdits, x) as ImageEdits;
        return validate(instance).then((errors) => {
            if (errors.length > 0) {
                return Promise.reject({
                    errors : errors.map(error => ({
                        property: error.property,
                        value: error.value,
                        // @ts-ignore
                        messages: Object.values(error.constraints).flat()
                    }))
                })
            }
            return instance;
        });
    }
}
