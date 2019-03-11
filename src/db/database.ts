import _ from "lodash";
import sqlite, {Database} from "sqlite3";

export class PromisedDatabase {
    private db: Database;
    private opened: boolean;

    constructor(db: Database) {
        this.db = db;
        this.opened = true;
    }

    public async execute(query: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.exec(query, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    public async run(query: string, args: any[] = []): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(query, args, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    public async select(query: string, args: any[] = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, args, (err, rows) => {
                if (err) {
                    throw reject(err);
                }

                return resolve(rows);
            });
        });
    }

    public async single(query: string, args: any[] = []): Promise<any> {
        return _.head(await this.select(query, args));
    }

    public async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                }

                this.opened = false;
                resolve();
            });
        });
    }

    public isOpened = () => this.opened;
}

export default function loadDatabase(dbPath: string, initStatement?: string): Promise<PromisedDatabase> {
    return new Promise(async (resolve, reject) => {
        const db = new sqlite.Database(dbPath, (err: Error) => {
            if (err) {
                reject(err);
            }

            const promisedDatabase = new PromisedDatabase(db);

            if (initStatement) {
                promisedDatabase.execute(initStatement).then(() => resolve(promisedDatabase));
            } else {
                resolve(promisedDatabase);
            }
        });
    });
}
