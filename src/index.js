import "@babel/polyfill";
import _ from 'lodash';
import './common';
import config from './config';
import loadDatabase, {initDatabase} from "./db";
import { initComparator } from './comparator/comparator';
import { initWebApp}  from './web'


Promise.all([loadDatabase(config.dbPath).then(initDatabase), loadDatabase(config.readDbPath)])
    .then((dbs) => {
        const comparatorConfig = _.extend(config, {
            headerIgnores: ["Content-Length", "ETag", "Date"],
            authorization: ["JWT"],
            bodyIgnores: [
                "id"
            ]
        });

        initComparator(dbs[0], dbs[1], comparatorConfig);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1)
    });

initWebApp(config);
