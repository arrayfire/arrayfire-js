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
    });

    describe('async', function () {
        let af = null;

        beforeEach(function () {
            af = new ArrayFire({ async: true });
            af.scope.begin();
        });

        afterEach(async(function* () {
            if (af) {
                af.scope.end();
                // FIXME: fastcall should supports asynchronous dispose + scope ending
                yield Promise.delay(100);
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