/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
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
            let af = require("../..")(id);

            describe("randu", function () {
                it("should yield uniform random int array with 2 dimensions", function (done) {
                    let f = async(function*() {
                        let array = af.randu(2, 4, af.types.dtype.s32);
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
                        let array = af.randu([2, 4], af.types.dtype.f32);
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
                it("should throw error when invoking normal random int array with 2 dimensions", function () {
                    try {
                        let array = af.randn(2, 4, af.types.dtype.s32);
                        return;
                    }
                    catch(e) {
                        if (/invalid dtype argument/ig.test(e.message)) {
                            return;
                        }
                        else {
                            throw new Error("This should throw appropriate error.");
                        }
                    }
                    throw new Error("This should throw.");

                });
                it("should yield normal random float array with 2 dimensions", function (done) {
                    let f = async(function*() {
                        let array = af.randn([2, 4], af.types.dtype.f32);
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