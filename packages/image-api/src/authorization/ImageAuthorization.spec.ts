import {ImageAuthorization} from "./ImageAuthorization";
import {ImageEdits} from "@/image/ImageEdits";

describe("ImageAuthorization", () => {
    const testDataSet = [
        {
            title : 'should allow all when no restrictions',
            authorizationOptions : {},
            imageEdits: {url: 'https://www.domain.com/image.jpg'},
            expectedAuthorization : true,
        },
        {
            title : 'should allow if image url match allowed patterns',
            authorizationOptions : {allowedUrlPatterns: ['test']},
            imageEdits: {url: 'https://www.domain.com/image-test.jpg'},
            expectedAuthorization : true,
        },
        {
            title : 'should deny if image url does not match allowed patterns',
            authorizationOptions : {allowedUrlPatterns: ['test*']},
            imageEdits: {url : 'https://www.domain.com/image.jpg'},
            expectedAuthorization : false,
        },
        {
            title : 'should allow image url by host using allowed patterns',
            authorizationOptions : {allowedUrlPatterns: ['www.domain.com']},
            imageEdits: {url : 'https://www.domain.com/image.jpg'},
            expectedAuthorization : true,
        },
        {
            title : 'should deny by host using allowed patterns',
            authorizationOptions : {allowedUrlPatterns: ['www.domain.com']},
            imageEdits: {url : 'https://www.another-domain.com/image.jpg'},
            expectedAuthorization : false,
        },
    ];

    test.each(testDataSet)('$title',
        ({authorizationOptions, imageEdits, expectedAuthorization}) => {
            const imageAuthorization = new ImageAuthorization(authorizationOptions);
            return expect(imageAuthorization.isAllowed(new ImageEdits(imageEdits)))
                .toBe(expectedAuthorization);
        }
    )
});