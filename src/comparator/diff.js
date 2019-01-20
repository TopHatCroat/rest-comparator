import _ from 'lodash';
import * as JsDiff from "diff";

import * as processors from "./processors";

export function body(original, replay, config) {
    const origIgnored = _.pick(JSON.parse(original), config.bodyIgnores);
    const replIgnored = _.pick(JSON.parse(replay), config.bodyIgnores);
    const orig = _.omit(JSON.parse(original), config.bodyIgnores);
    const repl = _.omit(JSON.parse(replay), config.bodyIgnores);

    const diff = JsDiff.diffJson(orig, repl);

    return {
        diff,
        origIgnored,
        replIgnored,
        actualOrig: original,
        actualRepl: replay
    };
}

export function headers(original, replay, config) {
    const orig = original.split('\r\n');
    const repl = replay.split('\r\n');
    const origIgnored = [];
    const replIgnored = [];
    const actualOrig = [];
    const actualRepl = [];
    const authHead = {
        original: "",
        replayed: ""
    };

    orig.forEach(h => {
        const header = h.toLowerCase();

        if (header.startsWith("authorization")) {
            authHead.original = h;
            return;
        }

        const filtered = _.findIndex(
            config.headerIgnores, i => {
                return header.startsWith(i.toLowerCase())
            }) !== -1;

        filtered ? origIgnored.push(h) : actualOrig.push(h);
    });

    repl.forEach(h => {
        const header = h.toLowerCase();

        if (header.startsWith("authorization")) {
            authHead.replayed = h;
            return;
        }

        const filtered = _.findIndex(
            config.headerIgnores, i => {
                return header.startsWith(i.toLowerCase())
            }) !== -1;

        filtered ? replIgnored.push(h) : actualRepl.push(h);
    });

    const diff = JsDiff.diffLines(actualOrig.join('\r\n'), actualRepl.join('\r\n'));
    const authDiff = processors.authorization(authHead.original, authHead.replayed);
    authDiff.forEach(e => diff.push(e));

    return {
        diff: diff,
        origIgnored: origIgnored.join('\r\n'),
        replIgnored: replIgnored.join('\r\n'),
        actualOrig: actualOrig.join('\r\n'),
        actualRepl: actualRepl.join('\r\n'),
    };
}
