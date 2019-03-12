import _ from "lodash";
import * as JsDiff from "diff";
import {toB64, fromB64} from "../common";

export function authorization(original, replayed, config) {
    if (_.isEmpty(original) || _.isEmpty(replayed)) {
        return JsDiff.diffLines(original, replayed);
    }

    const orig = original.split(" ");
    const repl = replayed.split(" ");

    if (orig[1].toLowerCase() === "bearer") {
        const origTokenParts = orig[2].split(".");
        const replTokenParts = repl[2].split(".");
        const origPayload = JSON.parse(fromB64(origTokenParts[1]));
        const replPayload = JSON.parse(fromB64(replTokenParts[1]));
        const origPayloadFiltered = _.omit(origPayload, config.ignores);
        const replPayloadFiltered = _.omit(replPayload, config.ignores);

        const diff = JsDiff.diffJson(origPayloadFiltered, replPayloadFiltered);
        const equal = diff.length === 1;
        this.value = {
            equal,
            original,
            replayed,
            processed: {
                original: origPayloadFiltered,
                replayed: replPayloadFiltered,
            },
        };
    } else {
        const procOrig = btoa(orig[2]);
        const procRepl = btoa(repl[2]);
        const equal = _.isEqual(procOrig, procRepl);

        this.value = {
            equal,
            original,
            replayed,
            processed: {
                original: procOrig,
                replayed: procRepl,
            },
        };
    }

    if (this.value.equal) {
        return [{
            count: 1,
            processed: this.value.processed,
            value: this.value.original,
        }];
    } else {
        return [{
            count: 1,
            processed: {
                original: this.value.processed.original,
            },
            removed: true,
            value: this.value.original,
        }, {
            added: true,
            count: 1,
            processed: {
                replayed: this.value.processed.replayed,
            },
            value: this.value.replayed,
        }];
    }
}
