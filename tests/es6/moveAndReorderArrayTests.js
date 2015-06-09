/*
Copyright 2015 Gábor Mezõ aka unbornchikken (gabor.mezo@outlook.com)

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