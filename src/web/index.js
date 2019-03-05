import express from "express";
import path from 'path';
import cors from "cors";

import rootRouter from './rootRouter';

export function initWebApp(config) {
    const app = express();

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

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err)
        }
        res.status(err.status);
        res.json({
            message: err.message
        })
    });

    app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
}
