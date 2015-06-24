/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mezõ aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict";

let assert = require("better-assert");
let _ = require("lodash");
let Bluebird = require("bluebird");

function testPlatform(id) {
    if (process.env["TEST_" + id] === "1") {
        describe(id + " platform", function () {
            let af = require("../..")(id);

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
