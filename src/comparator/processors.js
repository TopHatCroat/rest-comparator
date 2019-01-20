import _ from 'lodash';
import * as JsDiff from "diff";

export function authorization(original, replayed) {
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
        const origPayloadFiltered = _.omit(origPayload, ['jti', 'iat', 'exp']);
        const replPayloadFiltered = _.omit(replPayload, ['jti', 'iat', 'exp']);

        const diff = JsDiff.diffJson(origPayloadFiltered, replPayloadFiltered);
        const equal = diff.length === 1;
        this.value = {
            original,
            replayed,
            equal,
            processed: {
                original: origPayloadFiltered,
                replayed: replPayloadFiltered,
            }
        }
    } else {
        const procOrig = btoa(orig[2]);
        const procRepl = btoa(repl[2]);
        const equal = _.isEqual(procOrig, procRepl);

        this.value = {
            original,
            replayed,
            equal,
            processed: {
                original: procOrig,
                replayed: procRepl
            }
        }
    }

    if (this.value.equal) {
        return [{
            count: 1,
            value: this.value.original,
            processed: this.value.processed,
        }];
    } else {
        return [{
            count: 1,
            value: this.value.original,
            removed: true,
            processed: {
                original: this.value.processed.original,
            }
        }, {
            count: 1,
            value: this.value.replayed,
            added: true,
            processed: {
                replayed: this.value.processed.replayed,
            }
        }]
    }
}