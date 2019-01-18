import sqlite from 'sqlite3';
import config from './config';

const CREATE_STATEMENT = `
CREATE TABLE IF NOT EXISTS parsed_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    headerDiff TEXT,
    bodyDiff TEXT
);
`;

const INSERT_STATEMENT = `
    INSERT INTO parsed_responses(
        request_id, headerDiff, bodyDiff)
        VALUES (?, ?, ?)
`;

const SELECT_LATEST_STATEMENT = `
    SELECT * FROM responses`;

export const initDatabase = () => {
    const db = new sqlite.Database(config.dbPath);
    db.run(CREATE_STATEMENT);
    return db;
};

export const getLatest = (db, lastId) => {

};
