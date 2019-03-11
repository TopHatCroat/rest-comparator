import loadDatabase, {PromisedDatabase} from "./database";

import {
    newRequests,
    saveProcessed,
    CREATE_STATEMENT,
    INSERT_STATEMENT,
    SELECT_LAST_PARSED_ID_STATEMENT,
} from "./operations";

export {
    PromisedDatabase,
    newRequests,
    saveProcessed,
    CREATE_STATEMENT,
    INSERT_STATEMENT,
    SELECT_LAST_PARSED_ID_STATEMENT,
};

export default loadDatabase;
