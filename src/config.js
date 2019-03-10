import * as dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT,
    dbPath: process.env.DB_PATH,
    readDbPath: process.env.READ_DB_PATH,
};

export default config;