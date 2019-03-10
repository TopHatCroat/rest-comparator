import _ from "lodash";
import "./common";
import {initComparator} from "./comparator";
import config from "./config";
import loadDatabase, {CREATE_STATEMENT} from "./db";
import {initWebApp} from "./web";

Promise.all([loadDatabase(config.dbPath!, CREATE_STATEMENT), loadDatabase(config.readDbPath!)])
    .then((dbs) => {
        const comparatorConfig = _.extend(config, {
            body: {
                ignores: ["id"],
            },
            header: {
                ignores: ["Content-Length", "ETag", "Date"],
                parsers: [{
                    ignores: ["jti", "exp"],
                    matcher: "authorization",
                    type: "jwt",
                }],
            },
        });

        initComparator(dbs[0], dbs[1], comparatorConfig);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

initWebApp(config);
