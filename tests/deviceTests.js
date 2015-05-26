"use strict";

let assert = require("better-assert");
let _ = require("lodash");

function testPlatform(id) {
    if (process.env["TEST_" + id] === "1") {
        describe(id + " platform", function () {
            let af = require("..")(id);

            it("should return available devices", function() {
                let deviceCount = af.getDeviceCount();
                assert(deviceCount > 0);
                let infos = af.getDevices();
                assert(_.isArray(infos));
                assert(infos.length === deviceCount);
                for (let info of infos) {
                    assert(_.isString(info.name) && info.name);
                    assert(_.isString(info.platform) && info.platform);
                    assert(_.isString(info.compute) && info.compute);
                    assert(_.isBoolean(info.isDoubleAvailable));
                }
            });

            it("should do sync with callback", function(done) {
                af.sync(done);
            });

            it("should do sync with promise", function(done) {
                af.syncAsync().nodeify(done);
            });

            it("sync should failed if device is out of range", function(done) {
                af.syncAsync(100)
                    .then(function() {
                        done(new Error("This should fail!"));
                    },
                    function() {
                        done();
                    });
            });
        });
    }
}

describe("device methods", function() {
    testPlatform("CPU");
    testPlatform("OpenCL");
    testPlatform("CUDA");
});
