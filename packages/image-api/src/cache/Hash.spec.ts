import {getHash} from "./Hash";

describe("Hash", () => {
    it("getHash should return a string hash on a string", () => {
        const s = "https://www.domain.com/img/image.png";
        expect(typeof getHash(s)).toBe("string")
    });

    it("getHash should return consistent hash on the same string", () => {
        const s = "https://www.domain.com/img/image.png";
        expect(getHash(s)).toEqual(getHash(s));
    });

    it("getHash should return different hashes on different strings", () => {
        const s1 = "https://www.domain.com/img/image1.png"
        const s2 = "https://www.domain.com/img/image2.png"
        expect(getHash(s1)).not.toEqual(getHash(s2));
    });

    it("getHash should return null when image url is null", () => {
        // @ts-ignore
        expect(getHash(null)).toBeNull();
    });

    it("getHash should return null when image url is undefined", () => {
        // @ts-ignore
        expect(getHash()).toBeNull();
    });
});