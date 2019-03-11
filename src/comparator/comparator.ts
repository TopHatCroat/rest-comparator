import {PromisedDatabase, saveProcessed, newRequests} from "../db";
import * as diff from "./diff";

function processRequest(req: any, config: any): string[] {
    const diffHead = diff.headers(req.responseHeaders, req.replayHeaders, config.header);
    const diffBody = diff.body(JSON.parse(req.responseBody), JSON.parse(req.replayBody), config.body);

    return [
        req.id,
        JSON.stringify(diffHead.diff),
        // @ts-ignore
        JSON.stringify(diffHead.extra.origIgnored),
        // @ts-ignore
        JSON.stringify(diffHead.extra.replIgnored),
        JSON.stringify(diffBody),
        // @ts-ignore
        JSON.stringify(diffBody.extra.origIgnored),
        // @ts-ignore
        JSON.stringify(diffBody.extra.replIgnored),
    ];
}

export async function initComparator(writeDb: PromisedDatabase, readDb: PromisedDatabase, config: any) {
    for await (const request of newRequests(readDb, writeDb)) {
        const processed = processRequest(request, config);
        await saveProcessed(writeDb, processed);
    }
}
