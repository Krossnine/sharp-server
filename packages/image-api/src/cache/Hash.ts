import crypto from "crypto";

export function getHash(filename: string): string | null {
    if (!filename) return null;
    return crypto.createHash('sha256').update(filename).digest('hex');
}