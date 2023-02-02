import {ImageEdits, ImageFormat} from "./ImageEdits";

function withValidPlainObject(overrideOptions?: object) {
    return Object.assign({}, {
        width: 100,
        height: 100,
        url: 'https://www.domain.com/image.jpg',
        format: ImageFormat.AVIF,
    }, overrideOptions);
}

describe("ImageEdits", () => {
    const testDataSet = [
        {
            title : 'fromPlainObject should create a valid ImageEdits from plain object',
            plainObject : withValidPlainObject(),
            expectedError : null,
        },
        {
            title : 'fromPlainObject should create a valid ImageEdits without width',
            plainObject : withValidPlainObject({width: undefined}),
            expectedError : null,
        },
        {
            title : 'fromPlainObject should reject an error when width is a negative number',
            plainObject : withValidPlainObject({width: -666}),
            expectedError : {
                'errors': [{
                    property: "width",
                    value: -666,
                    messages: [
                        "width must be a positive number"
                    ],
                }]
            },
        },
        {
            title : 'fromPlainObject should reject an error when width is not a number',
            plainObject : withValidPlainObject({width: "not-a-number"}),
            expectedError :  {
                'errors': [{
                    property: "width",
                    value: NaN,
                    messages: [
                        "width must be a positive number",
                        "width must be an integer number"
                    ],
                }]
            },
        },
        {
            title : 'fromPlainObject should create a valid ImageEdits without height',
            plainObject : withValidPlainObject({height: undefined}),
            expectedError : null,
        },
        {
            title : 'fromPlainObject should reject an error when height is a negative number',
            plainObject : withValidPlainObject({height: -666}),
            expectedError : {
                'errors': [{
                    property: "height",
                    value: -666,
                    messages: [
                        "height must be a positive number"
                    ],
                }]
            },
        },
        {
            title : 'fromPlainObject should reject an error when height is not a number',
            plainObject : withValidPlainObject({height: "not-a-number"}),
            expectedError :  {
                'errors': [{
                    property: "height",
                    value: NaN,
                    messages: [
                        "height must be a positive number",
                        "height must be an integer number"
                    ],
                }]
            },
        },
        {
            title : 'fromPlainObject should reject an error when url is not provided',
            plainObject : withValidPlainObject({url:undefined}),
            expectedError :  {
                'errors': [{
                    property: "url",
                    value: undefined,
                    messages: [
                        "url must be an URL address"
                    ],
                }]
            },
        },
        {
            title : 'fromPlainObject should reject an error when url is invalid',
            plainObject : withValidPlainObject({url:"domain/image.jpg"}),
            expectedError :  {
                'errors': [{
                    property: "url",
                    value: "domain/image.jpg",
                    messages: [
                        "url must be an URL address"
                    ],
                }]
            },
        },
        {
            title : 'fromPlainObject should create a valid ImageEdits without format',
            plainObject : withValidPlainObject({format: undefined}),
            expectedError : null,
        },
        {
            title : 'fromPlainObject reject an error when format is invalid',
            plainObject : withValidPlainObject({format: 'INVALID_IMAGE_FORMAT'}),
            expectedError : {
                'errors': [{
                    property: "format",
                    value: "INVALID_IMAGE_FORMAT",
                    messages: [
                        "Allowed formats should be avif,webp,jpeg,jpg,png",
                    ],
                }]
            },
        },
    ].concat(
        Object.values(ImageFormat).map((imageFormat) => ({
            title : `fromPlainObject should create a valid ImageEdits when format = ${imageFormat}`,
            plainObject : withValidPlainObject({format: imageFormat}),
            expectedError : null,
        }))
    );

    test.each(testDataSet)('$title',
        ({plainObject, expectedError}) => {
            const transformAction = ImageEdits.fromPlainObject(plainObject);
            if (expectedError) {
                return expect(transformAction).rejects.toEqual(expectedError)
            } else {
                return transformAction.then((res) => {
                    expect(res).toBeInstanceOf(ImageEdits);
                    expect(res).toEqual(plainObject);
                });
            }
        }
    )
});
