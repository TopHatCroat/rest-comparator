import {sleep} from "../common";
import {PromisedDatabase} from "./database";

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

export async function saveProcessed(writeDb: PromisedDatabase, data: any) {
    return await writeDb.run(INSERT_STATEMENT, data);
}

export async function* newRequests(readDb: PromisedDatabase, writeDb: PromisedDatabase) {
    const lastIdRes = await writeDb.single(SELECT_LAST_PARSED_ID_STATEMENT);
    let lastId = lastIdRes.lastId || 0;

    const SELECT_LATEST_STATEMENT = "SELECT * FROM responses WHERE id > ?";

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
