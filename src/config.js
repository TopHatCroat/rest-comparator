import dotenv from "dotenv";

dotenv.config();

const config = {
    port: process.env.PORT,
    dbPath: process.env.DB_PATH,
};

export default config;