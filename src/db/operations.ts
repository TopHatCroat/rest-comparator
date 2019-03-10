import {sleep} from "../common";
import {SQLite} from "./database";

export const CREATE_STATEMENT = `
CREATE TABLE IF NOT EXISTS parsed_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    headerDiff TEXT,
    headerResponseIgnored TEXT,
    headerReplayIgnored TEXT,
    bodyDiff TEXT,
    bodyResponseIgnored TEXT,
    bodyReplayIgnored TEXT
);
`;

export const INSERT_STATEMENT = `
    INSERT INTO parsed_responses(
        request_id, headerDiff, headerResponseIgnored, headerReplayIgnored,
        bodyDiff, bodyResponseIgnored, bodyReplayIgnored)
        VALUES (?, ?, ?, ?, ?, ?, ?)
`;

export const SELECT_LAST_PARSED_ID_STATEMENT = "SELECT MAX(request_id) AS lastId FROM parsed_responses";

export async function* newRequests(readDb: SQLite, fromId = 0) {
    const SELECT_LATEST_STATEMENT = "SELECT * FROM responses WHERE id > ?";

    let lastId = fromId;
    while (readDb.isOpened()) {
        yield* (async function *() {
            await sleep(1000);

            const requests = await readDb.select(SELECT_LATEST_STATEMENT, [lastId]);
            for (const req of requests) {
                lastId = req.id;
                yield req;
            }
        })();
    }
}
