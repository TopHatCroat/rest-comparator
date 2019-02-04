import _ from "lodash";

export function onNewRequest(readDb, callback) {
    readDb.on('profile', (sql) => {
        if (sql.indexOf('INSERT INTO responses ') !== -1) {
            callback();
        }
    })
}

const CREATE_STATEMENT = `
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

const INSERT_STATEMENT = `
    INSERT INTO parsed_responses(
        request_id, headerDiff, headerResponseIgnored, headerReplayIgnored,
        bodyDiff, bodyResponseIgnored, bodyReplayIgnored)
        VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const SELECT_LAST_PARSED_ID_STATEMENT = 'SELECT MAX(request_id) AS lastId FROM parsed_responses';

const SELECT_LATEST_STATEMENT = 'SELECT * FROM responses WHERE id > ?';

export const initDatabase = async writeDb => {
  await writeDb.execute(CREATE_STATEMENT);
  return writeDb
};

export const writeParsedRequest = async (writeDb, data) => {
  await writeDb.execute(INSERT_STATEMENT, data);
};

export const getLatest = async (writeDb, readDb) => {
    let result = await writeDb.single(SELECT_LAST_PARSED_ID_STATEMENT);
    if (!_.isNumber(result.lastId)) {
        result.lastId = 0;
    }

    const latestRequests = await readDb.select(SELECT_LATEST_STATEMENT, [result.lastId]);

    return latestRequests;
};