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
let ref = require("ref");
let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let int = ref.types.int;
let float = ref.types.float;

function testPlatform (id) {
    if (process.env["TEST_" + id] === "1") {
        describe(id + " platform", function () {
            let fire = require("../..")(id);

            describe("join", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement join test for ${id}\n`);
                });
            });

            describe("tile", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement tile test for ${id}\n`);
                });
            });

            describe("reorder", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement iota reorder for ${id}\n`);
                });
            });

            describe("shift", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement shift test for ${id}\n`);
                });
            });

            describe("moddims", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement moddims test for ${id}\n`);
                });
            });

            describe("flat", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement flat test for ${id}\n`);
                });
            });

            describe("flip", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement flip test for ${id}\n`);
                });
            });

            describe("transpose", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement transpose test for ${id}\n`);
                });
            });
        });
    }
}

describe("Functions to create arrays", function () {
    testPlatform("CPU");
    testPlatform("OpenCL");
    testPlatform("CUDA");
});