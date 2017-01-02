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

        it('should support .index() for various parameter types', function () {
            var afArr = void 0;
            var afIdx = void 0;
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

            afArr = af.array([1, 2, 3, 4, 5]);
            afIdx = af.array([1, 0, 2]);
            indexed = afArr.index(afIdx);
            assert.deepEqual(indexed.toArray(), [2, 1, 3]);

            afArr = af.array(af.dim4(4, 4), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

            afIdx = af.array(af.dim4(3, 2), [1, 0, 2, 5, 10, 2]);

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

        it.only('should support .assign() for various parameter types', function () {
            var afArr = void 0;

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

        it('should support copy-on-write', function () {});
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

        it('should support .index() for various parameter types', async(regeneratorRuntime.mark(function _callee3() {
            var afArr, afIdx, indexed, arr, dims;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            afArr = void 0;
                            afIdx = void 0;
                            indexed = void 0;
                            arr = void 0;
                            dims = void 0;
                            _context3.next = 7;
                            return af.array([1, 2, 3, 4, 5]);

                        case 7:
                            afArr = _context3.sent;
                            _context3.next = 10;
                            return afArr.dims();

                        case 10:
                            dims = _context3.sent;

                            assert.strictEqual(dims[0], 5);
                            assert.strictEqual(dims[1], 1);
                            assert.strictEqual(dims[2], 1);
                            assert.strictEqual(dims[3], 1);
                            _context3.t0 = assert;
                            _context3.next = 18;
                            return afArr.elements();

                        case 18:
                            _context3.t1 = _context3.sent;

                            _context3.t0.strictEqual.call(_context3.t0, _context3.t1, 5);

                            _context3.t2 = assert;
                            _context3.next = 23;
                            return afArr.numdims();

                        case 23:
                            _context3.t3 = _context3.sent;

                            _context3.t2.strictEqual.call(_context3.t2, _context3.t3, 1);

                            _context3.next = 27;
                            return afArr.index(af.seq(1));

                        case 27:
                            indexed = _context3.sent;
                            _context3.t4 = assert;
                            _context3.next = 31;
                            return indexed.toArray();

                        case 31:
                            _context3.t5 = _context3.sent;
                            _context3.t6 = [2];

                            _context3.t4.deepEqual.call(_context3.t4, _context3.t5, _context3.t6);

                            _context3.next = 36;
                            return afArr.index(2);

                        case 36:
                            indexed = _context3.sent;
                            _context3.t7 = assert;
                            _context3.next = 40;
                            return indexed.toArray();

                        case 40:
                            _context3.t8 = _context3.sent;
                            _context3.t9 = [3];

                            _context3.t7.deepEqual.call(_context3.t7, _context3.t8, _context3.t9);

                            _context3.next = 45;
                            return afArr.index(af.seq(1, 3));

                        case 45:
                            indexed = _context3.sent;
                            _context3.t10 = assert;
                            _context3.next = 49;
                            return indexed.toArray();

                        case 49:
                            _context3.t11 = _context3.sent;
                            _context3.t12 = [2, 3, 4];

                            _context3.t10.deepEqual.call(_context3.t10, _context3.t11, _context3.t12);

                            _context3.next = 54;
                            return af.array(af.dim4(4, 4), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

                        case 54:
                            afArr = _context3.sent;
                            _context3.t13 = assert;
                            _context3.next = 58;
                            return afArr.elements();

                        case 58:
                            _context3.t14 = _context3.sent;

                            _context3.t13.strictEqual.call(_context3.t13, _context3.t14, 16);

                            _context3.t15 = assert;
                            _context3.next = 63;
                            return afArr.numdims();

                        case 63:
                            _context3.t16 = _context3.sent;

                            _context3.t15.strictEqual.call(_context3.t15, _context3.t16, 2);

                            _context3.t17 = assert;
                            _context3.next = 68;
                            return afArr.dims(0);

                        case 68:
                            _context3.t18 = _context3.sent;

                            _context3.t17.strictEqual.call(_context3.t17, _context3.t18, 4);

                            _context3.t19 = assert;
                            _context3.next = 73;
                            return afArr.dims(1);

                        case 73:
                            _context3.t20 = _context3.sent;

                            _context3.t19.strictEqual.call(_context3.t19, _context3.t20, 4);

                            _context3.next = 77;
                            return afArr.index(af.seq(2, 4));

                        case 77:
                            indexed = _context3.sent;
                            _context3.t21 = assert;
                            _context3.next = 81;
                            return indexed.toArray();

                        case 81:
                            _context3.t22 = _context3.sent;
                            _context3.t23 = [3, 4, 5];

                            _context3.t21.deepEqual.call(_context3.t21, _context3.t22, _context3.t23);

                            _context3.next = 86;
                            return afArr.index(af.idx(af.seq(0, 2), af.seq(1, 2)));

                        case 86:
                            indexed = _context3.sent;
                            _context3.t24 = assert;
                            _context3.next = 90;
                            return indexed.toArray();

                        case 90:
                            _context3.t25 = _context3.sent;
                            _context3.t26 = [5, 6, 7, 9, 10, 11];

                            _context3.t24.deepEqual.call(_context3.t24, _context3.t25, _context3.t26);

                            _context3.next = 95;
                            return afArr.index(af.idx(af.end, af.seq(2, 3)));

                        case 95:
                            indexed = _context3.sent;
                            _context3.t27 = assert;
                            _context3.next = 99;
                            return indexed.toArray();

                        case 99:
                            _context3.t28 = _context3.sent;
                            _context3.t29 = [12, 16];

                            _context3.t27.deepEqual.call(_context3.t27, _context3.t28, _context3.t29);

                            _context3.next = 104;
                            return afArr.index(af.span);

                        case 104:
                            indexed = _context3.sent;
                            _context3.t30 = assert;
                            _context3.next = 108;
                            return indexed.toArray();

                        case 108:
                            _context3.t31 = _context3.sent;
                            _context3.t32 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

                            _context3.t30.deepEqual.call(_context3.t30, _context3.t31, _context3.t32);

                            _context3.next = 113;
                            return afArr.index(af.idx(1, af.span));

                        case 113:
                            indexed = _context3.sent;
                            _context3.t33 = assert;
                            _context3.next = 117;
                            return indexed.toArray();

                        case 117:
                            _context3.t34 = _context3.sent;
                            _context3.t35 = [2, 6, 10, 14];

                            _context3.t33.deepEqual.call(_context3.t33, _context3.t34, _context3.t35);

                            _context3.next = 122;
                            return af.array([1, 2, 3, 4, 5]);

                        case 122:
                            afArr = _context3.sent;
                            _context3.next = 125;
                            return af.array([1, 0, 2]);

                        case 125:
                            afIdx = _context3.sent;
                            _context3.next = 128;
                            return afArr.index(afIdx);

                        case 128:
                            indexed = _context3.sent;
                            _context3.t36 = assert;
                            _context3.next = 132;
                            return indexed.toArray();

                        case 132:
                            _context3.t37 = _context3.sent;
                            _context3.t38 = [2, 1, 3];

                            _context3.t36.deepEqual.call(_context3.t36, _context3.t37, _context3.t38);

                            _context3.next = 137;
                            return af.array(af.dim4(4, 4), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);

                        case 137:
                            afArr = _context3.sent;
                            _context3.next = 140;
                            return af.array(af.dim4(3, 2), [1, 0, 2, 5, 10, 2]);

                        case 140:
                            afIdx = _context3.sent;
                            _context3.next = 143;
                            return afArr.index(afIdx);

                        case 143:
                            indexed = _context3.sent;
                            _context3.t39 = assert;
                            _context3.next = 147;
                            return indexed.toArray();

                        case 147:
                            _context3.t40 = _context3.sent;
                            _context3.t41 = [2, 1, 3, 6, 11, 3];

                            _context3.t39.deepEqual.call(_context3.t39, _context3.t40, _context3.t41);

                            _context3.next = 152;
                            return af.array(af.dim4(3, 3), [0, 1, 2, 3, 4, 5, 6, 7, 8]);

                        case 152:
                            afArr = _context3.sent;
                            _context3.next = 155;
                            return afArr.index(af.row(0));

                        case 155:
                            indexed = _context3.sent;
                            _context3.t42 = assert;
                            _context3.next = 159;
                            return indexed.toArray();

                        case 159:
                            _context3.t43 = _context3.sent;
                            _context3.t44 = [0, 3, 6];

                            _context3.t42.deepEqual.call(_context3.t42, _context3.t43, _context3.t44);

                            _context3.next = 164;
                            return afArr.index(af.row(2));

                        case 164:
                            indexed = _context3.sent;
                            _context3.t45 = assert;
                            _context3.next = 168;
                            return indexed.toArray();

                        case 168:
                            _context3.t46 = _context3.sent;
                            _context3.t47 = [2, 5, 8];

                            _context3.t45.deepEqual.call(_context3.t45, _context3.t46, _context3.t47);

                            _context3.next = 173;
                            return afArr.index(af.rows(0, 1));

                        case 173:
                            indexed = _context3.sent;
                            _context3.t48 = assert;
                            _context3.next = 177;
                            return indexed.toArray();

                        case 177:
                            _context3.t49 = _context3.sent;
                            _context3.t50 = [0, 1, 3, 4, 6, 7];

                            _context3.t48.deepEqual.call(_context3.t48, _context3.t49, _context3.t50);

                            _context3.next = 182;
                            return afArr.index(af.col(0));

                        case 182:
                            indexed = _context3.sent;
                            _context3.t51 = assert;
                            _context3.next = 186;
                            return indexed.toArray();

                        case 186:
                            _context3.t52 = _context3.sent;
                            _context3.t53 = [0, 1, 2];

                            _context3.t51.deepEqual.call(_context3.t51, _context3.t52, _context3.t53);

                            _context3.next = 191;
                            return afArr.index(af.col(2));

                        case 191:
                            indexed = _context3.sent;
                            _context3.t54 = assert;
                            _context3.next = 195;
                            return indexed.toArray();

                        case 195:
                            _context3.t55 = _context3.sent;
                            _context3.t56 = [6, 7, 8];

                            _context3.t54.deepEqual.call(_context3.t54, _context3.t55, _context3.t56);

                            _context3.next = 200;
                            return afArr.index(af.cols(1, 2));

                        case 200:
                            indexed = _context3.sent;
                            _context3.t57 = assert;
                            _context3.next = 204;
                            return indexed.toArray();

                        case 204:
                            _context3.t58 = _context3.sent;
                            _context3.t59 = [3, 4, 5, 6, 7, 8];

                            _context3.t57.deepEqual.call(_context3.t57, _context3.t58, _context3.t59);

                        case 207:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        })));
    });
});
//# sourceMappingURL=array.js.map