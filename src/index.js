import "@babel/polyfill";
import cors from "cors";
import express from "express";
import path from "path";
import config from './config';
import {initDatabase} from "./db";

import rootRouter from "./rootRouter";

const app = express();
initDatabase();

const corsOptions = {
    methods: "GET,HEAD,POST,DELETE",
    optionsSuccessStatus: 204,
    origin: "*",
    preflightContinue: false,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", rootRouter);

app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
