import _ from 'lodash';
import "chai/register-should";
import testData from "./data";
import {
    headers,
    body,
} from "../diff";

function added(diff) {
    return _.reduce(diff, (sum, d) => {
        if(d.added) return sum + d.value;
        else return sum;
    }, "");
}

function removed(diff) {
    return _.reduce(diff, (sum, d) => {
        if(d.removed) return sum + d.value;
        else return sum;
    }, "");
}

describe("HTTP headers comparator", function() {
    it("returns no changes with identical headers and empty config", function() {
        const rawHeaders = testData.headerNoAuth;

        const changes = headers(rawHeaders, rawHeaders, {});

        added(changes.diff).should.equal("");
        removed(changes.diff).should.equal("");
    });

    it("returns changes with different headers and empty config", function() {
        const changes = headers(testData.headerNoAuth, testData.headerNoAuth2, {});

        added(changes.diff).should.equal("Content-Type: text/html\r\n");
        removed(changes.diff).should.equal("Content-Type: application/json; charset=utf-8\r\n");
    });

    it("returns no changes with different, but ignored headers", function() {
        const changes = headers(testData.headerNoAuth, testData.headerNoAuth2, {
            ignores: ["Content-Type"]
        });

        added(changes.diff).should.equal("");
        removed(changes.diff).should.equal("");
    });

    it("returns no changes one sided ignored header change", function() {
        const changes = headers(testData.headerNoAuthMissingDate, testData.headerNoAuth, {
            ignores: ["Date"]
        });

        removed(changes.diff).should.equal("");
    });
});