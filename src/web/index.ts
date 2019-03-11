import _ from "lodash";
import cors from "cors";
import express from "express";
import {NextFunction, Request, Response} from "express-serve-static-core";
import path from "path";
import rootRouter from "./rootRouter";

export function initWebApp(config: any) {
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

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        if (res.headersSent) {
            return next(err);
        }

        const status = _.get(err, "status", 500);
        res.status(status);
        res.json({
            message: err.message,
        });
    });

    app.listen(config.port, () => console.log(`Listening on port ${config.port}`));
}
