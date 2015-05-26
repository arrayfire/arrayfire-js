"use strict";

let assert = require("better-assert");

describe("device methods", function() {
    describe("CPU", function() {
        let af = require("..")();
        it("should report count", function () {
            let deviceCount = af.getDeviceCount();
            assert(deviceCount > 0);
        });
    });
});
