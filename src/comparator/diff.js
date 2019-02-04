import _ from 'lodash';
import * as JsDiff from "diff";

import * as processors from "./processors";

export function body(original, replay, config) {
    const origIgnored = _.pick(original, config.ignores);
    const replIgnored = _.pick(replay, config.ignores);
    const orig = _.omit(original, config.ignores);
    const repl = _.omit(replay, config.ignores);

    const comparator = (left, right) => {
        console.log(left, right);
        return left === right;
    };

    const diff = JsDiff.diffJson(orig, repl, { comparator });

    return {
        diff,
        origIgnored,
        replIgnored,
        actualOrig: original,
        actualRepl: replay
    };
}

export function headers(original, replay, config) {

    const extra = {};
    const comparator = (left, right) => {
        const l = _.clone(left).toLowerCase();
        const r = _.clone(right).toLowerCase();

        const leftFiltered = _.findIndex(config.ignores, i => { return l.startsWith(i.toLowerCase())}) !== -1;
        const rightFiltered = _.findIndex(config.ignores, i => { return r.startsWith(i.toLowerCase())}) !== -1;
        if (leftFiltered || rightFiltered) {
            return true;
        }

        const parsers = _.get(config, 'parsers', []);
        for (let i = 0; i < parsers.length; i++) {
            const parser = parsers[i];

            if (l.matches(parser.matcher) !== null && r.matcher(parser.matcher)) {
                switch (parser.type) {
                    case "jwt":
                        const result = processors.authorization(left, right, parser);
                        extra.push({ [parser.matcher]: result });
                        return result.length === 1; // longer array means something was added and removed
                }
            }
        }

        return left === right;
    };

    const diff = JsDiff.diffLines(original, replay, { comparator });

    return {
        diff,
        extra,
    };
}
