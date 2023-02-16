export type ImageTransformOptions = {
  url: string;
  width?: string | undefined;
  height?: string | undefined;
  quality?: string | undefined;
  flip?:boolean | undefined;
  flop?:boolean | undefined;
  format?: string | undefined;
  rotate?: number | undefined;
  fit?: string | undefined;
  background?: string | undefined;
  blur?: boolean | undefined;
};

export class ImageClient {
  private readonly sharpImageServer: string;

  constructor(sharpImageServer: string) {
    this.sharpImageServer = sharpImageServer;
  }

  private filter(imageTransformOptions: ImageTransformOptions): ImageTransformOptions {
    // TODO : better undefined filtering using reduce
    return JSON.parse(JSON.stringify({
      url: imageTransformOptions.url,
      width: imageTransformOptions.width || undefined,
      height: imageTransformOptions.height || undefined,
      quality: imageTransformOptions.quality || undefined,
      flip: imageTransformOptions.flip || undefined,
      flop: imageTransformOptions.flop || undefined,
      format: imageTransformOptions.format || undefined,
      rotate: imageTransformOptions.rotate !== 0 ?  imageTransformOptions.rotate : undefined,
      fit: imageTransformOptions.fit || undefined,
      background: imageTransformOptions.background || undefined,
      blur: imageTransformOptions.blur || undefined,
    }));
  }

  public getImageUrl(imageTransformOptions: ImageTransformOptions) {
    // @ts-ignore
    const qp = new URLSearchParams(this.filter(imageTransformOptions));
    return `${this.sharpImageServer}?${qp.toString()}`;
  }

  // TODO : check if duplicate trailing slash
  public getCompressedImageUrl(imageTransformOptions: ImageTransformOptions) {
    return `${this.sharpImageServer}/${btoa(JSON.stringify(this.filter(imageTransformOptions)))}`;
  }
}
