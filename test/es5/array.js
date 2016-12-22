'use strict';

var Promise = require('bluebird');
var assert = require('assert');
var _ = require('lodash');
var async = Promise.coroutine;
var arrayFireJs = require('../..');
var ArrayFire = arrayFireJs.ArrayFire;
var fastcall = require('fastcall');
var ArrayType = fastcall.ArrayType;
var FloatArray = new ArrayType('float');
var IntArray = new ArrayType('int32');
var ref = fastcall.ref;

describe('AFArray', function () {
    describe('sync', function () {
        var af = null;

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
            var arr = void 0;
            var afArr = void 0;
            var dims = void 0;
            var buff = void 0;
            var refArr = void 0;

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
            var afArr = void 0;
            var indexed = void 0;
            var arr = void 0;
            var dims = void 0;

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

            afArr = af.array(af.dim4(4, 4), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

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
        var af = null;

        beforeEach(function () {
            af = new ArrayFire({ async: true });
            af.scope.begin();
        });

        afterEach(async(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!af) {
                                _context.next = 5;
                                break;
                            }

                            _context.next = 3;
                            return af.scope.end();

                        case 3:
                            af.release();
                            af = null;

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        })));

        it('could be created by calling af.array()', async(regeneratorRuntime.mark(function _callee2() {
            var arr, afArr, dims, buff, refArr;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            arr = void 0;
                            afArr = void 0;
                            dims = void 0;
                            buff = void 0;
                            refArr = void 0;


                            arr = [1, 2];
                            _context2.next = 8;
                            return af.array(arr);

                        case 8:
                            afArr = _context2.sent;
                            _context2.next = 11;
                            return afArr.dims();

                        case 11:
                            dims = _context2.sent;

                            assert.strictEqual(dims[0], 2);
                            assert.strictEqual(dims[1], 1);
                            assert.strictEqual(dims[2], 1);
                            assert.strictEqual(dims[3], 1);
                            assert.strictEqual(dims.elements, 2);
                            assert.strictEqual(dims.ndims, 1);
                            _context2.t0 = assert;
                            _context2.next = 21;
                            return afArr.dims(0);

                        case 21:
                            _context2.t1 = _context2.sent;

                            _context2.t0.strictEqual.call(_context2.t0, _context2.t1, 2);

                            _context2.t2 = assert;
                            _context2.next = 26;
                            return afArr.dims(1);

                        case 26:
                            _context2.t3 = _context2.sent;

                            _context2.t2.strictEqual.call(_context2.t2, _context2.t3, 1);

                            _context2.t4 = assert;
                            _context2.next = 31;
                            return afArr.dims(2);

                        case 31:
                            _context2.t5 = _context2.sent;

                            _context2.t4.strictEqual.call(_context2.t4, _context2.t5, 1);

                            _context2.t6 = assert;
                            _context2.next = 36;
                            return afArr.dims(3);

                        case 36:
                            _context2.t7 = _context2.sent;

                            _context2.t6.strictEqual.call(_context2.t6, _context2.t7, 1);

                            arr = new Float32Array([1, 2]);
                            _context2.next = 41;
                            return af.array(arr);

                        case 41:
                            afArr = _context2.sent;
                            _context2.next = 44;
                            return afArr.dims();

                        case 44:
                            dims = _context2.sent;

                            assert.strictEqual(dims[0], 2);
                            assert.strictEqual(dims[1], 1);
                            assert.strictEqual(dims[2], 1);
                            assert.strictEqual(dims[3], 1);
                            assert.strictEqual(dims.elements, 2);
                            assert.strictEqual(dims.ndims, 1);
                            _context2.t8 = assert;
                            _context2.next = 54;
                            return afArr.dims(0);

                        case 54:
                            _context2.t9 = _context2.sent;

                            _context2.t8.strictEqual.call(_context2.t8, _context2.t9, 2);

                            _context2.t10 = assert;
                            _context2.next = 59;
                            return afArr.dims(1);

                        case 59:
                            _context2.t11 = _context2.sent;

                            _context2.t10.strictEqual.call(_context2.t10, _context2.t11, 1);

                            _context2.t12 = assert;
                            _context2.next = 64;
                            return afArr.dims(2);

                        case 64:
                            _context2.t13 = _context2.sent;

                            _context2.t12.strictEqual.call(_context2.t12, _context2.t13, 1);

                            _context2.t14 = assert;
                            _context2.next = 69;
                            return afArr.dims(3);

                        case 69:
                            _context2.t15 = _context2.sent;

                            _context2.t14.strictEqual.call(_context2.t14, _context2.t15, 1);

                            _context2.next = 73;
                            return afArr.host();

                        case 73:
                            buff = _context2.sent;

                            assert(Buffer.isBuffer(buff));
                            refArr = new FloatArray(buff);
                            assert.equal(refArr.length, 2);
                            assert.equal(refArr.get(0), 1);
                            assert.equal(refArr.get(1), 2);
                            refArr.set(0, 0);
                            refArr.set(1, 0);
                            assert.equal(refArr.get(0), 0);
                            assert.equal(refArr.get(1), 0);
                            _context2.next = 85;
                            return afArr.host(refArr.buffer);

                        case 85:
                            assert.equal(refArr.length, 2);
                            assert.equal(refArr.get(0), 1);
                            assert.equal(refArr.get(1), 2);

                            arr = new FloatArray(2);
                            arr.set(0, 1);
                            arr.set(1, 2);
                            _context2.next = 93;
                            return af.array(af.dim4(1, 2), arr.buffer);

                        case 93:
                            afArr = _context2.sent;
                            _context2.next = 96;
                            return afArr.dims();

                        case 96:
                            dims = _context2.sent;

                            assert.strictEqual(dims[0], 1);
                            assert.strictEqual(dims[1], 2);
                            assert.strictEqual(dims[2], 1);
                            assert.strictEqual(dims[3], 1);
                            assert.strictEqual(dims.elements, 2);
                            assert.strictEqual(dims.ndims, 2);

                            _context2.next = 105;
                            return af.array(af.dim4(3), af.dtype.s32);

                        case 105:
                            afArr = _context2.sent;
                            _context2.next = 108;
                            return afArr.dims();

                        case 108:
                            dims = _context2.sent;

                            assert.strictEqual(dims[0], 3);
                            assert.strictEqual(dims[1], 1);
                            assert.strictEqual(dims[2], 1);
                            assert.strictEqual(dims[3], 1);
                            assert.strictEqual(dims.elements, 3);
                            assert.strictEqual(dims.ndims, 1);
                            _context2.next = 117;
                            return afArr.host();

                        case 117:
                            buff = _context2.sent;

                            assert(Buffer.isBuffer(buff));
                            refArr = new IntArray(buff);
                            assert.equal(refArr.length, 3);

                            _context2.next = 123;
                            return af.array(af.dim4(1, 3));

                        case 123:
                            afArr = _context2.sent;
                            _context2.next = 126;
                            return afArr.dims();

                        case 126:
                            dims = _context2.sent;

                            assert.strictEqual(dims[0], 1);
                            assert.strictEqual(dims[1], 3);
                            assert.strictEqual(dims[2], 1);
                            assert.strictEqual(dims[3], 1);
                            assert.strictEqual(dims.elements, 3);
                            assert.strictEqual(dims.ndims, 2);
                            _context2.t16 = assert;
                            _context2.next = 136;
                            return afArr.type();

                        case 136:
                            _context2.t17 = _context2.sent;
                            _context2.t18 = af.dtype.f32;

                            _context2.t16.strictEqual.call(_context2.t16, _context2.t17, _context2.t18);

                            _context2.t19 = assert;
                            _context2.next = 142;
                            return afArr.refType();

                        case 142:
                            _context2.t20 = _context2.sent;
                            _context2.t21 = ref.types.float;

                            _context2.t19.strictEqual.call(_context2.t19, _context2.t20, _context2.t21);

                            arr = [1, 2, 3, 4];
                            _context2.next = 148;
                            return af.array(af.dim4(1, 1, 4), arr, af.dtype.s32);

                        case 148:
                            afArr = _context2.sent;
                            _context2.next = 151;
                            return afArr.dims();

                        case 151:
                            dims = _context2.sent;

                            assert.strictEqual(dims[0], 1);
                            assert.strictEqual(dims[1], 1);
                            assert.strictEqual(dims[2], 4);
                            assert.strictEqual(dims[3], 1);
                            assert.strictEqual(dims.elements, 4);
                            assert.strictEqual(dims.ndims, 3);
                            _context2.next = 160;
                            return afArr.host();

                        case 160:
                            buff = _context2.sent;

                            assert(Buffer.isBuffer(buff));
                            refArr = new IntArray(buff);
                            assert.equal(refArr.length, 4);
                            assert.equal(refArr.get(0), 1);
                            assert.equal(refArr.get(1), 2);
                            assert.equal(refArr.get(2), 3);
                            assert.equal(refArr.get(3), 4);

                        case 168:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        })));
    });
});
//# sourceMappingURL=array.js.map