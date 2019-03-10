
export function toB64(str: string) {
    return Buffer.from(str).toString("base64");
}

export function fromB64(str: string) {
    return Buffer.from(str, "base64").toString();
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
