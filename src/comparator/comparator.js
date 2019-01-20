import { getLatest, onNewRequest, writeParsedRequest} from "../db";

import * as diff from './diff';

function processLatest(writeDb, readDb, config) {
    getLatest(writeDb, readDb).then(latestRequests => {
        latestRequests.forEach((req) => {
            const diffHead = diff.headers(req.responseHeaders, req.replayHeaders, config);
            const diffBody = diff.body(req.responseBody, req.replayBody, config);

            writeParsedRequest(writeDb, [
                req.id,
                JSON.stringify(diffHead.diff),
                JSON.stringify(diffHead.origIgnored),
                JSON.stringify(diffHead.replIgnored),
                JSON.stringify(diffBody),
                JSON.stringify(diffBody.origIgnored),
                JSON.stringify(diffBody.replIgnored),
            ]).then((e) => {});
        })
    });
}

export function initComparator(writeDb, readDb, config) {
    processLatest(writeDb, readDb, config);

    onNewRequest(readDb, () => {
        processLatest(writeDb, readDb, config);
    });
}