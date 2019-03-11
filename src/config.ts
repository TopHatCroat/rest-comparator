import * as dotenv from "dotenv";

dotenv.config();

const config = {
    dbPath: process.env.DB_PATH,
    readDbPath: process.env.READ_DB_PATH,
    port: process.env.PORT,
    gorExecutable: process.env.GOR_EXECUTABLE,
};

export default config;
