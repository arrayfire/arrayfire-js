/*
Copyright 2015 G�bor Mez� aka unbornchikken

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

function testPlatform(id) {
    if (process.env["TEST_" + id] === "1") {
        describe(id + " platform", function () {
            let fire = require("../..")(id);
            let AFArray = fire.AFArray;

            it("should export AFArray constructor", function() {
                assert(_.isFunction(AFArray));
            });

            it("should create empty", function() {
                let array = new AFArray();
                assert(_.isObject(array));
                assert(array.bytes() === 0);
                assert(array.elements() === 0);
                assert(array.isempty());
                assert(_.isFunction(array.host));
                assert(_.isFunction(array.hostAsync));
                assert(_.isUndefined(array.hostAsyncAsync));
                assert(_.isFunction(array.hostSync));
                assert(_.isUndefined(array.hostSyncAsync));
                assert(_.isUndefined(array.hostSyncSync));
                assert(_.isUndefined(array.hostAsyncSync));
            });

            it("should fail with one number argument", function() {
                try {
                    let array = new AFArray(1);
                    assert(false);
                }
                catch (e) {
                }
            });

            it("should create new one dimensional", function() {
                let array = new AFArray(10, fire.types.dtype.s32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 4);
                assert(array.elements() === 10);
                assert(array.type() === fire.types.dtype.s32);
                assert(array.numdims() === 1);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 1);
                assert(array.dims(2) === 1);
                assert(array.dims(3) === 1);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10);
                assert(dims.ndims === 1);
                assert(dims.dims[0] === 10);
                assert(dims.dims[1] === 1);
                assert(dims.dims[2] === 1);
                assert(dims.dims[3] === 1);
                assert(array.isempty() === false);
                assert(array.isscalar() === false);
                assert(array.isvector() === true);
                assert(array.isrow() === false);
                assert(array.iscolumn() === true);
                assert(array.iscomplex() === false);
                assert(array.isreal() === true);
                assert(array.isdouble() === false);
                assert(array.issingle() === false);
                assert(array.isrealfloating() === false);
                assert(array.isfloating() === false);
                assert(array.isinteger() === true);
                assert(array.isbool() === false);
            });

            it("should create new two dimensional", function() {
                let array = new AFArray(10, 20, fire.types.dtype.f32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 20 * 4);
                assert(array.elements() === 10 * 20);
                assert(array.type() === fire.types.dtype.f32);
                assert(array.numdims() === 2);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 20);
                assert(array.dims(2) === 1);
                assert(array.dims(3) === 1);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10 * 20);
                assert(dims.ndims === 2);
                assert(dims.dims[0] === 10);
                assert(dims.dims[1] === 20);
                assert(dims.dims[2] === 1);
                assert(dims.dims[3] === 1);
                assert(array.isempty() === false);
                assert(array.isscalar() === false);
                assert(array.isvector() === false);
                assert(array.isrow() === false);
                assert(array.iscolumn() === false);
                assert(array.iscomplex() === false);
                assert(array.isreal() === true);
                assert(array.isdouble() === false);
                assert(array.issingle() === true);
                assert(array.isrealfloating() === true);
                assert(array.isfloating() === true);
                assert(array.isinteger() === false);
                assert(array.isbool() === false);
            });

            it("should create new three dimensional", function() {
                let array = new AFArray(10, 20, 30, fire.types.dtype.f32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 20 * 30 * 4);
                assert(array.elements() === 10 * 20 * 30);
                assert(array.type() === fire.types.dtype.f32);
                assert(array.numdims() === 3);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 20);
                assert(array.dims(2) === 30);
                assert(array.dims(3) === 1);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10 * 20 * 30);
                assert(dims.ndims === 3);
                assert(dims.dims[0] === 10);
                assert(dims.dims[1] === 20);
                assert(dims.dims[2] === 30);
                assert(dims.dims[3] === 1);
                assert(array.isempty() === false);
                assert(array.isscalar() === false);
                assert(array.isvector() === false);
                assert(array.isrow() === false);
                assert(array.iscolumn() === false);
                assert(array.iscomplex() === false);
                assert(array.isreal() === true);
                assert(array.isdouble() === false);
                assert(array.issingle() === true);
                assert(array.isrealfloating() === true);
                assert(array.isfloating() === true);
                assert(array.isinteger() === false);
                assert(array.isbool() === false);
            });

            function verify4(array) {
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 20 * 30 * 40 * 4);
                assert(array.elements() === 10 * 20 * 30 * 40);
                assert(array.type() === fire.types.dtype.f32);
                assert(array.numdims() === 4);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 20);
                assert(array.dims(2) === 30);
                assert(array.dims(3) === 40);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10 * 20 * 30 * 40);
                assert(dims.ndims === 4);
                assert(dims.dims[0] === 10);
                assert(dims.dims[1] === 20);
                assert(dims.dims[2] === 30);
                assert(dims.dims[3] === 40);
                assert(array.isempty() === false);
                assert(array.isscalar() === false);
                assert(array.isvector() === false);
                assert(array.isrow() === false);
                assert(array.iscolumn() === false);
                assert(array.iscomplex() === false);
                assert(array.isreal() === true);
                assert(array.isdouble() === false);
                assert(array.issingle() === true);
                assert(array.isrealfloating() === true);
                assert(array.isfloating() === true);
                assert(array.isinteger() === false);
                assert(array.isbool() === false);
            }

            it("should create new four dimensional", function() {
                let array = new AFArray(10, 20, 30, 40, fire.types.dtype.f32);
                verify4(array);
            });

            it("should create new four dimensional from dim4", function() {
                let array = new AFArray({ dims: [10, 20, 30, 40] }, fire.types.dtype.f32);
                verify4(array);
            });

            it("should create new four dimensional from dim4 array", function() {
                let array = new AFArray([10, 20, 30, 40], fire.types.dtype.f32);
                verify4(array);
            });

            it("should initialize from buffer, copyable, and readable - asynchronously w/ generators", function(done) {
                let f = async(function*() {
                    let int = ref.types.int;
                    const count = 10;
                    let buff = new Buffer(int.size * count);
                    for (let v = 0; v < count; v++) {
                        int.set(buff, v * int.size, v * v);
                    }

                    assert(_.isFunction(AFArray.create));
                    assert(_.isFunction(AFArray.createAsync));

                    let array = yield AFArray.createAsync(count, fire.types.dtype.s32, buff);
                    assert(array.bytes() === count * int.size);
                    assert(array.type() === fire.types.dtype.s32);

                    let buff2 = new Buffer(int.size * count);
                    yield array.hostAsync(buff2);
                    for (let v = 0; v < count; v++) {
                        let v1 = int.get(buff, v * int.size);
                        let v2 = int.get(buff2, v * int.size);
                        assert(v1 === v2);
                        assert(v1 === v * v);
                    }

                    let array2 = array.copy();
                    assert(array2 instanceof AFArray);
                    assert(array2.bytes() === array.bytes());
                    let buff3 = yield array2.hostAsync();
                    assert(buff3 instanceof Buffer);
                    assert(buff3.length === int.size * count);
                    for (let v = 0; v < count; v++) {
                        let v1 = int.get(buff, v * int.size);
                        let v2 = int.get(buff3, v * int.size);
                        assert(v1 === v2);
                        assert(v1 === v * v);
                    }

                    let v = yield array2.valueAsync();
                    assert(v === 0.0);

                    v = yield array2.at(0, 0).valueAsync();
                    assert(v === 1.0);

                    /*v = yield array2.at(0, 2).scalarAsync();
                    assert(v === 4.0);*/
                });
                f().nodeify(done);
            });

            it("should initialize from buffer, copyable, and readable - synchronously (blocking)", function() {
                let int = ref.types.int;
                const count = 10;
                let buff = new Buffer(int.size * count);
                for (let v = 0; v < count; v++) {
                    int.set(buff, v * int.size, v * v);
                }

                assert(_.isFunction(AFArray.create));
                assert(_.isFunction(AFArray.createSync));

                let array = AFArray.createSync(count, fire.types.dtype.s32, buff);
                assert(array.bytes() === count * int.size);
                assert(array.type() === fire.types.dtype.s32);

                let buff2 = new Buffer(int.size * count);
                array.hostSync(buff2);
                for (let v = 0; v < count; v++) {
                    let v1 = int.get(buff, v * int.size);
                    let v2 = int.get(buff2, v * int.size);
                    assert(v1 === v2);
                    assert(v1 === v * v);
                }

                let array2 = array.copy();
                assert(array2 instanceof AFArray);
                assert(array2.bytes() === array.bytes());
                let buff3 = array2.hostSync();
                assert(buff3 instanceof Buffer);
                assert(buff3.length === int.size * count);
                for (let v = 0; v < count; v++) {
                    let v1 = int.get(buff, v * int.size);
                    let v2 = int.get(buff3, v * int.size);
                    assert(v1 === v2);
                    assert(v1 === v * v);
                }

                let v = array2.valueSync();
                assert(v === 0.0);

                /*v = array2.at(0, 1).valueSync();
                assert(v === 1.0);

                v = array2.at(0, 2).scalarSync();
                assert(v === 4.0);*/
            });

            it("should be tests for assignment operators", function() {
                console.log(`TODO: implement array assignment operator tests for ${id}\n`);
            });

            it("should be tests for indexing operators", function() {
                console.log(`TODO: implement array indexing operator tests for ${id}\n`);
            });

            it("should be tests for row", function() {
                console.log(`TODO: implement array row test for ${id}\n`);
            });

            it("should be tests for col", function() {
                console.log(`TODO: implement array col test for ${id}\n`);
            });

            it("should be tests for slice", function() {
                console.log(`TODO: implement array slice test for ${id}\n`);
            });

            it("should be tests for rows", function() {
                console.log(`TODO: implement array rows test for ${id}\n`);
            });

            it("should be tests for cols", function() {
                console.log(`TODO: implement array cols test for ${id}\n`);
            });

            it("should be tests for slices", function() {
                console.log(`TODO: implement array slices test for ${id}\n`);
            });

            it("should be tests for as", function() {
                console.log(`TODO: implement array as test for ${id}\n`);
            });

            it("should be tests for arithmetic operators", function() {
                console.log(`TODO: implement array arithmetic operator tests for ${id}\n`);
            });

            it("should be tests for logical operators", function() {
                console.log(`TODO: implement array logical operator tests for ${id}\n`);
            });
        });
    }
}

describe("AFArray class and methods", function() {
    testPlatform("CPU");
    testPlatform("OpenCL");
    testPlatform("CUDA");
});