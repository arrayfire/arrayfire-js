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

        it.only('should support .index() for various parameter types', function () {
            let afArr;
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

            /*
            afArr = array(af, [1, 2, 3, 4, 5])
            afIdx = array(af, [1.0f0, 0.0f0, 2.0f0])
            indexed = afArr[afIdx]
            @test host(indexed) == [2, 1, 3]

            afArr = array(af, [[1,2,3,4] [5,6,7,8] [9,10,11,12] [13, 14, 15, 16]])
            afIdx = array(af, [[1.0f0, 0.0f0, 2.0f0] [5.0f0, 10.0f0, 2.0f0]])
            indexed = afArr[afIdx]
            @test host(indexed) == [2,1,3,6,11,3]

            # Col, Row
            afArr = array(af, [[0,1,2] [3,4,5] [6,7,8]])

            @test host(afArr[row(af, 0)]) == [0 3 6]
            @test host(afArr[row(af, 2)]) == [2 5 8]

            @test host(afArr[rows(af, 0, 1)]) == [[0,1] [3,4] [6,7]]

            @test host(afArr[col(af, 0)]) == [0,1,2]
            @test host(afArr[col(af, 2)]) == [6,7,8]

            @test host(afArr[cols(af, 1,2)]) == [[3,4,5] [6,7,8]]
            */
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
    });
});