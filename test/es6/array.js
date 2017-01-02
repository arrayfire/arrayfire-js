'use strict';
const Promise = require('bluebird');
const assert = require('assert');
const _ = require('lodash');
const async = Promise.coroutine;
const arrayFireJs = require('../..');
const ArrayFire = arrayFireJs.ArrayFire;
const fastcall = require('fastcall');
const ArrayType = fastcall.ArrayType;
const FloatArray = new ArrayType('float');
const IntArray = new ArrayType('int32');
const ref = fastcall.ref;

describe('AFArray', function () {
    describe('sync', function () {
        let af = null;

        beforeEach(function () {
            af = new ArrayFire();
            af.setBackend(af.backend.CPU);
            af.scope.begin();
        });

        afterEach(function () {
            if (af) {
                af.scope.end();
                af.release();
                af = null;
            }
        });

        it('could be created by calling af.array()', function () {
            let arr;
            let afArr;
            let dims;
            let buff;
            let refArr;

            arr = [1, 2];
            afArr = af.array(arr);
            dims = afArr.dims();
            assert.strictEqual(dims[0], 2);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 1);
            assert.strictEqual(afArr.dims(0), 2);
            assert.strictEqual(afArr.dims(1), 1);
            assert.strictEqual(afArr.dims(2), 1);
            assert.strictEqual(afArr.dims(3), 1);

            arr = new Float32Array([1, 2]);
            afArr = af.array(arr);
            dims = afArr.dims();
            assert.strictEqual(dims[0], 2);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 1);
            assert.strictEqual(afArr.dims(0), 2);
            assert.strictEqual(afArr.dims(1), 1);
            assert.strictEqual(afArr.dims(2), 1);
            assert.strictEqual(afArr.dims(3), 1);
            buff = afArr.host();
            assert(Buffer.isBuffer(buff));
            refArr = new FloatArray(buff);
            assert.equal(refArr.length, 2);
            assert.equal(refArr.get(0), 1);
            assert.equal(refArr.get(1), 2);
            refArr.set(0, 0);
            refArr.set(1, 0);
            assert.equal(refArr.get(0), 0);
            assert.equal(refArr.get(1), 0);
            afArr.host(refArr.buffer);
            assert.equal(refArr.length, 2);
            assert.equal(refArr.get(0), 1);
            assert.equal(refArr.get(1), 2);

            arr = new FloatArray(2);
            arr.set(0, 1);
            arr.set(1, 2);
            afArr = af.array(af.dim4(1, 2), arr.buffer);
            dims = afArr.dims();
            assert.strictEqual(dims[0], 1);
            assert.strictEqual(dims[1], 2);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 2);

            afArr = af.array(af.dim4(3), af.dtype.s32);
            dims = afArr.dims();
            assert.strictEqual(dims[0], 3);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 3);
            assert.strictEqual(dims.ndims, 1);
            buff = afArr.host();
            assert(Buffer.isBuffer(buff));
            refArr = new IntArray(buff);
            assert.equal(refArr.length, 3);

            afArr = af.array(af.dim4(1, 3));
            dims = afArr.dims();
            assert.strictEqual(dims[0], 1);
            assert.strictEqual(dims[1], 3);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 3);
            assert.strictEqual(dims.ndims, 2);
            assert.strictEqual(afArr.type(), af.dtype.f32);
            assert.strictEqual(afArr.refType(), ref.types.float);

            arr = [1, 2, 3, 4];
            afArr = af.array(af.dim4(1, 1, 4), arr, af.dtype.s32);
            dims = afArr.dims();
            assert.strictEqual(dims[0], 1);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 4);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 4);
            assert.strictEqual(dims.ndims, 3);
            buff = afArr.host();
            assert(Buffer.isBuffer(buff));
            refArr = new IntArray(buff);
            assert.equal(refArr.length, 4);
            assert.equal(refArr.get(0), 1);
            assert.equal(refArr.get(1), 2);
            assert.equal(refArr.get(2), 3);
            assert.equal(refArr.get(3), 4);
        });

        it('should support .index() for various parameter types', function () {
            let afArr;
            let afIdx;
            let indexed;
            let arr;
            let dims;

            afArr = af.array([1, 2, 3, 4, 5]);
            dims = afArr.dims();
            assert.strictEqual(dims[0], 5);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(afArr.elements(), 5);
            assert.strictEqual(afArr.numdims(), 1);

            indexed = afArr.index(af.seq(1));
            assert.deepEqual(indexed.toArray(), [2]);

            indexed = afArr.index(2);
            assert.deepEqual(indexed.toArray(), [3]);

            indexed = afArr.index(af.seq(1, 3));
            assert.deepEqual(indexed.toArray(), [2, 3, 4]);

            afArr = af.array(af.dim4(4, 4),
                 [1,  2,  3,  4,
                  5,  6,  7,  8,
                  9, 10, 11, 12,
                 13, 14, 15, 16]);

            assert.strictEqual(afArr.elements(), 16);
            assert.strictEqual(afArr.numdims(), 2);
            assert.strictEqual(afArr.dims(0), 4);
            assert.strictEqual(afArr.dims(1), 4);

            indexed = afArr.index(af.seq(2, 4));
            assert.deepEqual(indexed.toArray(), [3, 4, 5]);

            indexed = afArr.index(af.idx(af.seq(0, 2), af.seq(1, 2)));
            assert.deepEqual(indexed.toArray(), [5, 6, 7, 9, 10, 11]);

            indexed = afArr.index(af.idx(af.end, af.seq(2, 3)));
            assert.deepEqual(indexed.toArray(), [12, 16]);

            indexed = afArr.index(af.span);
            assert.deepEqual(indexed.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

            indexed = afArr.index(af.idx(1, af.span));
            assert.deepEqual(indexed.toArray(), [2, 6, 10, 14]);

            afArr = af.array([1, 2, 3, 4, 5]);
            afIdx = af.array([1, 0, 2]);
            indexed = afArr.index(afIdx);
            assert.deepEqual(indexed.toArray(), [2, 1, 3]);

            afArr = af.array(af.dim4(4, 4),
                 [1,  2,  3,  4,
                  5,  6,  7,  8,
                  9, 10, 11, 12,
                 13, 14, 15, 16]);

            afIdx = af.array(af.dim4(3, 2),
                [1,  0, 2,
                 5, 10, 2]);

            indexed = afArr.index(afIdx);
            assert.deepEqual(indexed.toArray(), [2, 1, 3, 6, 11, 3]);

            // Col, Row
            afArr = af.array(af.dim4(3, 3), [0, 1, 2, 3, 4, 5, 6, 7, 8]);

            indexed = afArr.index(af.row(0));
            assert.deepEqual(indexed.toArray(), [0, 3, 6]);

            indexed = afArr.index(af.row(2));
            assert.deepEqual(indexed.toArray(), [2, 5, 8]);

            indexed = afArr.index(af.rows(0, 1));
            assert.deepEqual(indexed.toArray(), [0, 1, 3, 4, 6, 7]);

            indexed = afArr.index(af.col(0));
            assert.deepEqual(indexed.toArray(), [0, 1, 2]);

            indexed = afArr.index(af.col(2));
            assert.deepEqual(indexed.toArray(), [6, 7, 8]);

            indexed = afArr.index(af.cols(1, 2));
            assert.deepEqual(indexed.toArray(), [3, 4, 5, 6, 7, 8]);
        });

        it('should support .assign() for various parameter types', function () {
            let afArr;

            afArr = af.array([1, 2, 3, 4]);
            afArr.assign(af.span, 5);
            assert.deepEqual(afArr.toArray(), [5, 5, 5, 5]);

            afArr = af.array([1, 2, 3, 4]);
            afArr.assign(af.seq(1, 2), 5.5);
            assert.deepEqual(afArr.toArray(), [1, 5.5, 5.5, 4]);
            /*

            afArr = array(af, [1,2,3,4])
            afArr[2:3] = 5.5f0
            @test host(afArr) == [1,5,5,4]

            afArr = array(af, [1,2,3,4])
            afArr[1:2] = array(af, [10.1f0, 11.1f0])
            @test host(afArr) == [10,11,3,4]

            @test_throws AFErrorException afArr[1:2] = array(af, [10.1f0, 11.1f0, 12.2f0])

            afArr = array(af, [[1,2,3,4] [5,6,7,8] [9,10,11,12] [13, 14, 15, 16]])
            afArr[:, 3:4] = array(af, [[1,2,3,4] [5,6,7,8]])
            @test host(afArr) == [[1,2,3,4] [5,6,7,8] [1,2,3,4] [5,6,7,8]]

            afArr[3:4, :] = 1.1f0
            @test host(afArr) == [[1,2,1,1] [5,6,1,1] [1,2,1,1] [5,6,1,1]]

            afArr = array(af, [[1,2,3,4] [5,6,7,8] [9,10,11,12] [13, 14, 15, 16]])
            afArr[array(af, [10, 11, 12, 13, 14, 15])] = array(af, [55, 66, 77, 88, 99, 100])
            @test host(afArr) == [[1,2,3,4] [5,6,7,8] [9,10,55,66] [77, 88, 99, 100]]
            afArr[array(af, [[1, 2, 3] [4, 5, 6]])] = array(af, [55, 66, 77, 88, 99, 100])
            @test host(afArr) == [[1,55,66,77] [88,99,100,8] [9,10,55,66] [77, 88, 99, 100]]

            @test_throws AFErrorException afArr[array(af, [[1, 2, 3] [4, 5, 6]])] = array(af, [[55, 66, 77] [88, 99, 100]])

            afArr = array(af, [[1,2,3,4] [5,6,7,8] [9,10,11,12] [13, 14, 15, 16]])
            afArr[array(af, [[1, 2, 3] [4, 5, 6]])] = -1
            @test host(afArr) == [[1,-1,-1,-1] [-1,-1,-1,8] [9,10,11,12] [13, 14, 15, 16]]
            */
        });

        it('should support copy-on-write', function () {
        });
    });

    describe('async', function () {
        let af = null;

        beforeEach(function () {
            af = new ArrayFire({ async: true });
            af.scope.begin();
        });

        afterEach(async(function* () {
            if (af) {
                yield af.scope.end();
                af.release();
                af = null;
            }
        }));

        it('could be created by calling af.array()', async(function* () {
            let arr;
            let afArr;
            let dims;
            let buff;
            let refArr;

            arr = [1, 2];
            afArr = yield af.array(arr);
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 2);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 1);
            assert.strictEqual(yield afArr.dims(0), 2);
            assert.strictEqual(yield afArr.dims(1), 1);
            assert.strictEqual(yield afArr.dims(2), 1);
            assert.strictEqual(yield afArr.dims(3), 1);

            arr = new Float32Array([1, 2]);
            afArr = yield af.array(arr);
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 2);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 1);
            assert.strictEqual(yield afArr.dims(0), 2);
            assert.strictEqual(yield afArr.dims(1), 1);
            assert.strictEqual(yield afArr.dims(2), 1);
            assert.strictEqual(yield afArr.dims(3), 1);
            buff = yield afArr.host();
            assert(Buffer.isBuffer(buff));
            refArr = new FloatArray(buff);
            assert.equal(refArr.length, 2);
            assert.equal(refArr.get(0), 1);
            assert.equal(refArr.get(1), 2);
            refArr.set(0, 0);
            refArr.set(1, 0);
            assert.equal(refArr.get(0), 0);
            assert.equal(refArr.get(1), 0);
            yield afArr.host(refArr.buffer);
            assert.equal(refArr.length, 2);
            assert.equal(refArr.get(0), 1);
            assert.equal(refArr.get(1), 2);

            arr = new FloatArray(2);
            arr.set(0, 1);
            arr.set(1, 2);
            afArr = yield af.array(af.dim4(1, 2), arr.buffer);
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 1);
            assert.strictEqual(dims[1], 2);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 2);

            afArr = yield af.array(af.dim4(3), af.dtype.s32);
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 3);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 3);
            assert.strictEqual(dims.ndims, 1);
            buff = yield afArr.host();
            assert(Buffer.isBuffer(buff));
            refArr = new IntArray(buff);
            assert.equal(refArr.length, 3);

            afArr = yield af.array(af.dim4(1, 3));
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 1);
            assert.strictEqual(dims[1], 3);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 3);
            assert.strictEqual(dims.ndims, 2);
            assert.strictEqual(yield afArr.type(), af.dtype.f32);
            assert.strictEqual(yield afArr.refType(), ref.types.float);

            arr = [1, 2, 3, 4];
            afArr = yield af.array(af.dim4(1, 1, 4), arr, af.dtype.s32);
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 1);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 4);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 4);
            assert.strictEqual(dims.ndims, 3);
            buff = yield afArr.host();
            assert(Buffer.isBuffer(buff));
            refArr = new IntArray(buff);
            assert.equal(refArr.length, 4);
            assert.equal(refArr.get(0), 1);
            assert.equal(refArr.get(1), 2);
            assert.equal(refArr.get(2), 3);
            assert.equal(refArr.get(3), 4);
        }));

        it('should support .index() for various parameter types', async(function* () {
            let afArr;
            let afIdx;
            let indexed;
            let arr;
            let dims;

            afArr = yield af.array([1, 2, 3, 4, 5]);
            dims = yield afArr.dims();
            assert.strictEqual(dims[0], 5);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(yield afArr.elements(), 5);
            assert.strictEqual(yield afArr.numdims(), 1);

            indexed = yield afArr.index(af.seq(1));
            assert.deepEqual(yield indexed.toArray(), [2]);

            indexed = yield afArr.index(2);
            assert.deepEqual(yield indexed.toArray(), [3]);

            indexed = yield afArr.index(af.seq(1, 3));
            assert.deepEqual(yield indexed.toArray(), [2, 3, 4]);

            afArr = yield af.array(af.dim4(4, 4),
                 [1,  2,  3,  4,
                  5,  6,  7,  8,
                  9, 10, 11, 12,
                 13, 14, 15, 16]);

            assert.strictEqual(yield afArr.elements(), 16);
            assert.strictEqual(yield afArr.numdims(), 2);
            assert.strictEqual(yield afArr.dims(0), 4);
            assert.strictEqual(yield afArr.dims(1), 4);

            indexed = yield afArr.index(af.seq(2, 4));
            assert.deepEqual(yield indexed.toArray(), [3, 4, 5]);

            indexed = yield afArr.index(af.idx(af.seq(0, 2), af.seq(1, 2)));
            assert.deepEqual(yield indexed.toArray(), [5, 6, 7, 9, 10, 11]);

            indexed = yield afArr.index(af.idx(af.end, af.seq(2, 3)));
            assert.deepEqual(yield indexed.toArray(), [12, 16]);

            indexed = yield afArr.index(af.span);
            assert.deepEqual(yield indexed.toArray(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

            indexed = yield afArr.index(af.idx(1, af.span));
            assert.deepEqual(yield indexed.toArray(), [2, 6, 10, 14]);

            afArr = yield af.array([1, 2, 3, 4, 5]);
            afIdx = yield af.array([1, 0, 2]);
            indexed = yield afArr.index(afIdx);
            assert.deepEqual(yield indexed.toArray(), [2, 1, 3]);

            afArr = yield af.array(af.dim4(4, 4),
                 [1,  2,  3,  4,
                  5,  6,  7,  8,
                  9, 10, 11, 12,
                 13, 14, 15, 16]);

            afIdx = yield af.array(af.dim4(3, 2),
                [1,  0, 2,
                 5, 10, 2]);

            indexed = yield afArr.index(afIdx);
            assert.deepEqual(yield indexed.toArray(), [2, 1, 3, 6, 11, 3]);

            // Col, Row
            afArr = yield af.array(af.dim4(3, 3), [0, 1, 2, 3, 4, 5, 6, 7, 8]);

            indexed = yield afArr.index(af.row(0));
            assert.deepEqual(yield indexed.toArray(), [0, 3, 6]);

            indexed = yield afArr.index(af.row(2));
            assert.deepEqual(yield indexed.toArray(), [2, 5, 8]);

            indexed = yield afArr.index(af.rows(0, 1));
            assert.deepEqual(yield indexed.toArray(), [0, 1, 3, 4, 6, 7]);

            indexed = yield afArr.index(af.col(0));
            assert.deepEqual(yield indexed.toArray(), [0, 1, 2]);

            indexed = yield afArr.index(af.col(2));
            assert.deepEqual(yield indexed.toArray(), [6, 7, 8]);

            indexed = yield afArr.index(af.cols(1, 2));
            assert.deepEqual(yield indexed.toArray(), [3, 4, 5, 6, 7, 8]);
        }));
    });
});