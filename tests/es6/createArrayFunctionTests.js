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

            describe("randu", function () {
                it("should yield uniform random int array with 2 dimensions", function (done) {
                    let f = async(function*() {
                        let array = yield fire.randuAsync(2, 4, fire.types.dtype.s32);
                        let data = yield array.copyToHostAsync();
                        assert(data instanceof Buffer);
                        assert(data.length == 2 * 4 * int.size);

                        for (let i = 0; i < data.length / int.size; i++) {
                            const v = int.get(data, i * int.size);
                            assert(v >= Number.MIN_SAFE_INTEGER && v <= Number.MAX_SAFE_INTEGER);
                            assert(Math.floor(v) === v);
                        }
                    });
                    f().nodeify(done);
                });
                it("should yield uniform random float array with 2 dimensions", function (done) {
                    let f = async(function*() {
                        let array = yield fire.randuAsync([2, 4], fire.types.dtype.f32);
                        let data = yield array.copyToHostAsync();
                        assert(data instanceof Buffer);
                        assert(data.length == 2 * 4 * float.size);

                        for (let i = 0; i < data.length / float.size; i++) {
                            const v = float.get(data, i * float.size);
                            assert(v === 0 || v === 1.0 || (v > 0 && v < 1.0 && v % 1));
                        }
                    });
                    f().nodeify(done);
                });
            });

            describe("randf", function () {
                it("should throw error when invoking normal random int array with 2 dimensions", function (done) {
                    let f = async(function*() {
                        let array = yield fire.randnAsync(2, 4, fire.types.dtype.s32);
                    });
                    f()
                        .then(function () {
                            done(new Error("This should throw."));
                        },
                        function (e) {
                            if (/invalid dtype argument/ig.test(e.message)) {
                                done();
                            }
                            else {
                                done(new Error("This should throw appropriate error."));
                            }
                        });

                });
                it("should yield normal random float array with 2 dimensions", function (done) {
                    let f = async(function*() {
                        let array = yield fire.randnAsync([2, 4], fire.types.dtype.f32);
                        let data = yield array.copyToHostAsync();
                        assert(data instanceof Buffer);
                        assert(data.length == 2 * 4 * float.size);

                        for (let i = 0; i < data.length / float.size; i++) {
                            const v = float.get(data, i * float.size);
                            assert(v === 0 || (v > -4.0 && v < 4.0 && v % 1));
                        }
                    });
                    f().nodeify(done);
                });
            });

            describe("identity", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement identity test for ${id}\n`);
                });
            });

            describe("range", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement range test for ${id}\n`);
                });
            });

            describe("iota", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement iota test for ${id}\n`);
                });
            });

            describe("diag", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement diag test for ${id}\n`);
                });
            });

            describe("constant", function () {
                it("should be implemented", function() {
                    console.log(`TODO: implement constant test for ${id}\n`);
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