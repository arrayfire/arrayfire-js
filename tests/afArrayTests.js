"use strict";

let assert = require("better-assert");
let _ = require("lodash");
let ref = require("ref");

function testPlatform(id) {
    if (process.env["TEST_" + id] === "1") {
        describe(id + " platform", function () {
            let af = require("..")(id);
            let AFArray = af.AFArray;

            it("should export AFArray constructor", function() {
                assert(_.isFunction(AFArray));
            });

            it("should create empty", function() {
                let array = new AFArray();
                assert(_.isObject(array));
                assert(array.bytes() === 0);
                assert(array.elements() === 0);
                assert(array.isempty());
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
                let array = new AFArray(10, af.types.dtype.s32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 4);
                assert(array.elements() === 10);
                assert(array.type() === af.types.dtype.s32);
                assert(array.numdims() === 1);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 1);
                assert(array.dims(2) === 1);
                assert(array.dims(3) === 1);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10);
                assert(dims.ndims === 1);
                assert(dims.dim0 === 10);
                assert(dims.dim1 === 1);
                assert(dims.dim2 === 1);
                assert(dims.dim3 === 1);
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
                let array = new AFArray(10, 20, af.types.dtype.f32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 20 * 4);
                assert(array.elements() === 10 * 20);
                assert(array.type() === af.types.dtype.f32);
                assert(array.numdims() === 2);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 20);
                assert(array.dims(2) === 1);
                assert(array.dims(3) === 1);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10 * 20);
                assert(dims.ndims === 2);
                assert(dims.dim0 === 10);
                assert(dims.dim1 === 20);
                assert(dims.dim2 === 1);
                assert(dims.dim3 === 1);
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
                let array = new AFArray(10, 20, 30, af.types.dtype.f32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 20 * 30 * 4);
                assert(array.elements() === 10 * 20 * 30);
                assert(array.type() === af.types.dtype.f32);
                assert(array.numdims() === 3);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 20);
                assert(array.dims(2) === 30);
                assert(array.dims(3) === 1);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10 * 20 * 30);
                assert(dims.ndims === 3);
                assert(dims.dim0 === 10);
                assert(dims.dim1 === 20);
                assert(dims.dim2 === 30);
                assert(dims.dim3 === 1);
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

            it("should create new four dimensional", function() {
                let array = new AFArray(10, 20, 30, 40, af.types.dtype.f32);
                assert(_.isObject(array));
                assert(array.bytes() === 10 * 20 * 30 * 40 * 4);
                assert(array.elements() === 10 * 20 * 30 * 40);
                assert(array.type() === af.types.dtype.f32);
                assert(array.numdims() === 4);
                assert(array.dims(0) === 10);
                assert(array.dims(1) === 20);
                assert(array.dims(2) === 30);
                assert(array.dims(3) === 40);
                let dims = array.dims();
                assert(_.isObject(dims));
                assert(dims.elements === 10 * 20 * 30 * 40);
                assert(dims.ndims === 4);
                assert(dims.dim0 === 10);
                assert(dims.dim1 === 20);
                assert(dims.dim2 === 30);
                assert(dims.dim3 === 40);
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

            it("should initialize from buffer, copyable, and readable", function(done) {
                let f = af.async(function*() {
                    let int = ref.types.int;
                    const count = 10;
                    let buff = new Buffer(int.size * count);
                    for (let v = 0; v < count; v++) {
                        int.set(buff, v * int.size, v * v);
                    }

                    assert(_.isFunction(AFArray.create));
                    assert(_.isFunction(AFArray.createAsync));

                    let array = yield AFArray.createAsync(count, buff, af.types.dtype.s32);
                    assert(array.bytes() === count * int.size);
                    assert(array.type() === af.types.dtype.s32);
                    let buff2 = new Buffer(int.size * count);
                    yield array.hostAsync(buff2);
                    for (let v = 0; v < count; v++) {
                        let v1 = int.get(buff, v * int.size);
                        let v2 = int.get(buff2, v * int.size);
                        assert(v1 === v2);
                    }
                    let array2 = array.copy();
                    assert(array2 instanceof AFArray);
                    assert(array2.bytes() === array.bytes());
                    let buff3 = new Buffer(int.size * count);
                    yield array2.hostAsync(buff3);
                    for (let v = 0; v < count; v++) {
                        let v1 = int.get(buff, v * int.size);
                        let v2 = int.get(buff3, v * int.size);
                        assert(v1 === v2);
                    }
                });
                f().nodeify(done);
            });
        });
    }
}

describe("AFArray class and methods", function() {
    testPlatform("CPU");
    testPlatform("OpenCL");
    testPlatform("CUDA");
});