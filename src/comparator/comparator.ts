import {INSERT_STATEMENT, newRequests} from "../db";
import {SQLite} from "../db/database";
import * as diff from "./diff";
import {SELECT_LAST_PARSED_ID_STATEMENT} from "../db/operations";

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

export async function initComparator(writeDb: SQLite, readDb: SQLite, config: any) {
    const res = await writeDb.single(SELECT_LAST_PARSED_ID_STATEMENT);

    for await (const request of newRequests(readDb, res.lastId || 0)) {
        const processed = processRequest(request, config);
        await writeDb.run(INSERT_STATEMENT, processed);
    }
}
