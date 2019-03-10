import * as dotenv from "dotenv";

dotenv.config();

const config = {
    dbPath: process.env.DB_PATH,
    port: process.env.PORT,
    readDbPath: process.env.READ_DB_PATH,
};

export default config;
