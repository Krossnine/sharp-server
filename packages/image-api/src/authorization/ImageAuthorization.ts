import {ImageEdits} from "@/image/ImageEdits";

export type AuthorizationOptions = {
    allowedUrlPatterns?: Array<string>;
}

export class ImageAuthorization {
    public allowedUrlPatterns: Array<RegExp> = [];

    constructor(authorizationOptions?: AuthorizationOptions) {
        if (authorizationOptions) {
            this.allowedUrlPatterns = (authorizationOptions.allowedUrlPatterns || []).map(allowedUrlPattern => {
                return new RegExp(allowedUrlPattern)
            });
        }
    }

    protected checkIncludeUrls(imageEdits: ImageEdits) {
        if (!this.allowedUrlPatterns || this.allowedUrlPatterns.length === 0) {
            return true;
        }
        return this.allowedUrlPatterns.some((allowedUrlPattern) => {
            return imageEdits.url.match(allowedUrlPattern);
        });
    }

    isAllowed(imageEdits: ImageEdits) {
        return this.checkIncludeUrls(imageEdits);
    }
}
