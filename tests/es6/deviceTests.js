/*
Copyright 2015 Gábor Mezõ aka unbornchikken

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict";

let assert = require("better-assert");
let _ = require("lodash");
let Bluebird = require("bluebird");

function testPlatform(id) {
    if (process.env["TEST_" + id] === "1") {
        describe(id + " platform", function () {
            let fire = require("../..")(id);

            it("should return available devices", function() {
                let deviceCount = fire.getDeviceCount();
                assert(deviceCount > 0);
                let infos = fire.getDevices();
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
                fire.sync(done);
            });

            it("should do sync with promise", function(done) {
                fire.syncAsync().nodeify(done);
            });

            it("sync should failed if device is out of range", function(done) {
                fire.syncAsync(100)
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
