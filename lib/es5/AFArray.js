'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fastcall = require('fastcall');
var ref = fastcall.ref;
var errors = require('./errors');
var assert = require('assert');
var Disposable = fastcall.Disposable;
var typedefs = require('./typedefs');
var DimTArray = typedefs.DimTArray;
var Dim4 = require('./Dim4');
var longlong = ref.types.longlong;
var Promise = require('bluebird');
var async = Promise.coroutine;
var ArrayType = fastcall.ArrayType;
var arrayIndexing = require('./arrayIndexing');
var _ = require('lodash');
var helpers = require('./helpers');

var AFArray = function (_Disposable) {
    _inherits(AFArray, _Disposable);

    _createClass(AFArray, null, [{
        key: 'define',
        value: function define(af) {
            var lib = af._lib;
            var intf = lib.interface;

            // retainArray

            lib.declare('int af_retain_array(void** outArr, void* arr)');

            af.retainArray = af._makeFunction(function () {
                this.res = ref.alloc(typedefs.handleType);
            }, function (array) {
                return intf.af_retain_array(this.res, helpers.getHandle(array));
            }, function () {
                return ref.deref(this.res);
            });

            // releaseArray

            lib.declare('int af_release_array(void* arr)');

            af.releaseArray = af._makeFunction(function (array) {
                return intf.af_release_array(helpers.getHandle(array));
            });

            // createHandle

            lib.declare('int af_create_handle(void** outArr, uint ndims, longlong* dims, int type)');

            af.createHandle = af._makeFunction(function () {
                this.res = ref.alloc(typedefs.handleType);
            }, function () {
                var dims = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                var len = dims ? dims.ndims : 0;
                return intf.af_create_handle(this.res, len, dims.buffer, type);
            }, function () {
                return ref.deref(this.res);
            });

            // createArray

            lib.declare('int af_create_array(void** outArr, void* data, uint ndims, longlong* dims, int type)');

            af.createArray = af._makeFunction(function () {
                this.res = ref.alloc(typedefs.handleType);
            }, function (data, dims) {
                var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : af.dtype.f32;

                var len = dims ? dims.ndims : 0;
                try {
                    return intf.af_create_array(this.res, helpers.toBuffer(data), len, dims.buffer, type);
                } catch (err) {
                    if (err instanceof TypeError) {
                        throw new TypeError('Argument "data" is not a Buffer.');
                    }
                    throw err;
                }
            }, function () {
                return ref.deref(this.res);
            });

            // deviceArray

            lib.declare('int af_device_array(void** outArr, void* data, uint ndims, longlong* dims, int type)');

            af.deviceArray = af._makeFunction(function () {
                this.res = ref.alloc(typedefs.handleType);
            }, function (data, dims) {
                var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

                var len = dims ? dims.ndims : 0;
                assert(Buffer.isBuffer(data), 'Argument "data" is not a Buffer.');
                return intf.af_device_array(this.res, data, len, dims.buffer, type);
            }, function () {
                return ref.deref(this.res);
            });

            // ctors

            af.array = af._makeFunction(function () {
                var argsLen = arguments.length;

                // array()
                if (argsLen === 0) {
                    return intf.createHandle();
                }

                var firstArg = arguments[0];

                if (Buffer.isBuffer(firstArg)) {
                    // array(handle)
                    return firstArg;
                }

                if (_.isArray(firstArg)) {
                    return af.createArray(firstArg, af.dim4(firstArg.length));
                }

                if (_.isTypedArray(firstArg)) {
                    return af.createArray(firstArg, af.dim4(firstArg.length), af.getDTypeOfTypedArray(firstArg));
                }

                if (firstArg instanceof AFArray) {
                    if (argsLen === 1) {
                        // array(otherArray)
                        return af.retainArray(firstArg);
                    } else {
                        // array(otherArray, dims...)
                        var _secondArg = arguments[1];
                        assert(_secondArg instanceof Dim4, 'Second argument is not a dimension.');
                        return af.moddims(firstArg, arguments[1]);
                    }
                }

                var dims = af.dim4(firstArg);

                assert(dims.ndims > 0, 'First argument is not a dimension.');

                if (argsLen === 1) {
                    // array(dims..., f32)
                    return af.createHandle(dims, af.dtype.f32);
                }

                var secondArg = arguments[1];
                var thirdArg = argsLen >= 3 ? arguments[2] : null;

                if (Buffer.isBuffer(secondArg)) {
                    var type = af.dtype.f32;
                    var source = af.source.host;
                    var index = 2;
                    if (index < argsLen) {
                        type = arguments[index];
                        index++;
                        if (index < argsLen) {
                            source = arguments[index];
                        }
                    }
                    // array(dims..., ptr, [type[, source]])
                    if (source === af.source.host) {
                        return af.createArray(secondArg, dims, type);
                    }
                    return af.deviceArray(secondArg, dims, type);
                }

                if (_.isArray(secondArg)) {
                    if (_.isNumber(thirdArg)) {
                        return af.createArray(makeBufferFromJSArray(secondArg, thirdArg), dims, thirdArg);
                    }
                    return af.createArray(secondArg, dims);
                }

                if (_.isTypedArray(secondArg)) {
                    if (_.isNumber(thirdArg)) {
                        return af.createArray(makeBufferFromJSArray(secondArg, thirdArg), dims, thirdArg);
                    }
                    return af.createArray(secondArg, dims, af.getDTypeOfTypedArray(secondArg));
                }

                function makeBufferFromJSArray(jsArray, dtype) {
                    var len = jsArray.length;
                    var type = af.dtypeToRefType(dtype);
                    var buff = new Buffer(len * type.size);
                    for (var i = 0; i < len; i++) {
                        type.set(buff, i * type.size, jsArray[i]);
                    }
                    return buff;
                }

                // array(dims...[, type])
                assert(secondArg >= 0 && secondArg <= af.dtype.u16, 'Second argument is not a dtype.');
                return af.createHandle(dims, secondArg);
            }, function (handle) {
                return new AFArray(af, handle);
            });

            // getDims

            lib.declare('int af_get_dims(longlong* dim0, longlong* dim1, longlong* dim2, longlong* dim3, void* arr)');

            af.getDims = af._makeFunction(function () {
                this.dims = null;
                this.n = -1;
            }, function (array) {
                var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

                this.dims = new Dim4();
                this.n = n;
                var buff = this.dims.buffer;
                var dim0 = buff.slice(0);
                var dim1 = buff.slice(longlong.size);
                var dim2 = buff.slice(longlong.size * 2);
                var dim3 = buff.slice(longlong.size * 3);
                return intf.af_get_dims(dim0, dim1, dim2, dim3, helpers.getHandle(array));
            }, function () {
                var n = this.n;
                if (n >= 0 && n < 4) {
                    return this.dims[n];
                }
                return this.dims;
            });

            // getDataPtr

            lib.declare('int af_get_data_ptr(void* ptr, void* arr)');

            af.getDataPtr = af._makeFunction(function (array, ptr) {
                return intf.af_get_data_ptr(ptr, helpers.getHandle(array));
            });

            // getType

            lib.declare('int af_get_type(uint* outType, void* arr)');

            af.getType = af._makeFunction(function () {
                this.outType = ref.alloc(ref.types.uint);
            }, function (array) {
                return intf.af_get_type(this.outType, helpers.getHandle(array));
            }, function () {
                return this.outType.deref();
            });

            af.getRefType = af._makeFunction({
                verify: false,
                call: function call(array) {
                    return af.getType(array);
                },
                done: function done(type) {
                    return af.dtypeToRefType(type);
                }
            });

            // getNumdims

            lib.declare('int af_get_numdims(uint* outNum, void* arr)');

            af.getNumdims = af._makeFunction(function () {
                this.outNum = ref.alloc(ref.types.uint);
            }, function (array) {
                return intf.af_get_numdims(this.outNum, helpers.getHandle(array));
            }, function () {
                return this.outNum.deref();
            });

            // getElements

            lib.declare('int af_get_elements(longlong* outElems, void* arr)');

            af.getElements = af._makeFunction(function () {
                this.outElems = ref.alloc(ref.types.longlong);
            }, function (array) {
                return intf.af_get_elements(this.outElems, helpers.getHandle(array));
            }, function () {
                return this.outElems.deref();
            });

            // isEmpty

            lib.declare('int af_is_empty(bool* outEmpty, void* arr)');

            af.isEmpty = af._makeFunction(function () {
                this.outEmpty = ref.alloc(ref.types.bool);
            }, function (array) {
                return intf.af_is_empty(this.outEmpty, helpers.getHandle(array));
            }, function () {
                return this.outEmpty.deref();
            });

            // eval

            var hasMultiEval = false;
            var multiEvalEmu = null;
            lib.declare('int af_eval(void* arr)');
            if (lib.isSymbolExists('af_eval_multiple')) {
                lib.declare('int af_eval_multiple(int num, PointerArray arrays)');
                hasMultiEval = true;
            } else {
                multiEvalEmu = async(regeneratorRuntime.mark(function _callee(arrays, len) {
                    var i, res;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    i = 0;

                                case 1:
                                    if (!(i < len)) {
                                        _context.next = 10;
                                        break;
                                    }

                                    _context.next = 4;
                                    return intf.af_eval(helpers.getHandle(arr[i]));

                                case 4:
                                    res = _context.sent;

                                    if (!(res > 0)) {
                                        _context.next = 7;
                                        break;
                                    }

                                    return _context.abrupt('return', res);

                                case 7:
                                    i++;
                                    _context.next = 1;
                                    break;

                                case 10:
                                    return _context.abrupt('return', 0);

                                case 11:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));
            }

            af.eval = af._makeFunction(function () {
                this.pointers = new lib.arrays.PointerArray(10);
            }, function (arr) {
                if (_.isArray(arr)) {
                    len = Math.min(10, arr.length);
                    if (!len) {
                        return 0;
                    }
                    if (hasMultiEval) {
                        for (var i = 0; i < len; i++) {
                            this.pointers.set(i, helpers.getHandle(arr[i]));
                        }
                        return intf.af_eval_multiple(len, this.pointers);
                    } else if (af.options.async) {
                        return multiEvalEmu(arr, len);
                    } else {
                        for (var _i = 0; _i < len; _i++) {
                            var res = intf.af_eval(helpers.getHandle(arr[_i]));
                            if (res > 0) {
                                return res;
                            }
                        }
                        return 0;
                    }
                } else {
                    return intf.af_eval(helpers.getHandle(arr));
                }
            });

            // index + assign

            arrayIndexing(af, AFArray);
        }
    }]);

    function AFArray(af, handle) {
        _classCallCheck(this, AFArray);

        var _this = _possibleConstructorReturn(this, (AFArray.__proto__ || Object.getPrototypeOf(AFArray)).call(this, function () {
            return af.releaseArray(handle);
        }));

        _this.af = af;
        _this.handle = handle;
        _this._host = _this._makeHost();
        _this._toArray = _this._makeToArray();
        _this._toRefArray = _this._makeToRefArray();
        _this._index = _this._makeIndex();
        _this._assign = _this._makeAssign();
        return _this;
    }

    _createClass(AFArray, [{
        key: 'type',
        value: function type() {
            return this.af.getType(this);
        }
    }, {
        key: 'refType',
        value: function refType() {
            return this.af.getRefType(this);
        }
    }, {
        key: 'dims',
        value: function dims(n) {
            return this.af.getDims(this, n);
        }
    }, {
        key: 'host',
        value: function host(ptr) {
            return this._host(ptr);
        }
    }, {
        key: 'toRefArray',
        value: function toRefArray() {
            return this._toRefArray();
        }
    }, {
        key: 'toArray',
        value: function toArray() {
            return this._toArray();
        }
    }, {
        key: 'numdims',
        value: function numdims() {
            return this.af.getNumdims(this);
        }
    }, {
        key: 'elements',
        value: function elements() {
            return this.af.getElements(this);
        }
    }, {
        key: 'isempty',
        value: function isempty() {
            return this.af.isEmpty(this);
        }
    }, {
        key: 'eval',
        value: function _eval() {
            return this.af.eval(this);
        }
    }, {
        key: 'index',
        value: function index(idx) {
            return this._index(idx);
        }
    }, {
        key: 'assign',
        value: function assign(idx, value) {
            return this._assign(idx, value);
        }
    }, {
        key: '_makeToArray',
        value: function _makeToArray() {
            var self = this;
            var af = this.af;
            if (af.options.async) {
                return async(regeneratorRuntime.mark(function _callee2(ptr) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    _context2.t0 = refArrayToArray;
                                    _context2.next = 3;
                                    return self.toRefArray();

                                case 3:
                                    _context2.t1 = _context2.sent;
                                    return _context2.abrupt('return', (0, _context2.t0)(_context2.t1));

                                case 5:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));
            }
            return function () {
                return refArrayToArray(self.toRefArray());
            };

            function refArrayToArray(refArr) {
                var arr = new Array(refArr.length);
                for (var i = 0; i < refArr.length; i++) {
                    arr[i] = refArr.get(i);
                }
                return arr;
            }
        }
    }, {
        key: '_makeToRefArray',
        value: function _makeToRefArray() {
            var self = this;
            var af = this.af;
            if (af.options.async) {
                return async(regeneratorRuntime.mark(function _callee3(ptr) {
                    var HostArray, arr;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.t0 = ArrayType;
                                    _context3.next = 3;
                                    return self.refType();

                                case 3:
                                    _context3.t1 = _context3.sent;
                                    HostArray = new _context3.t0(_context3.t1);
                                    _context3.t2 = HostArray;
                                    _context3.next = 8;
                                    return self.elements();

                                case 8:
                                    _context3.t3 = _context3.sent;
                                    arr = new _context3.t2(_context3.t3);
                                    _context3.next = 12;
                                    return af.getDataPtr(self, arr.buffer);

                                case 12:
                                    return _context3.abrupt('return', arr);

                                case 13:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));
            }
            return function () {
                var HostArray = new ArrayType(self.refType());
                var arr = new HostArray(self.elements());
                af.getDataPtr(self, arr.buffer);
                return arr;
            };
        }
    }, {
        key: '_makeHost',
        value: function _makeHost() {
            var self = this;
            var af = this.af;
            if (af.options.async) {
                return async(regeneratorRuntime.mark(function _callee4(ptr) {
                    var HostArray, elems;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    if (ptr) {
                                        _context4.next = 10;
                                        break;
                                    }

                                    _context4.t0 = ArrayType;
                                    _context4.next = 4;
                                    return self.refType();

                                case 4:
                                    _context4.t1 = _context4.sent;
                                    HostArray = new _context4.t0(_context4.t1);
                                    _context4.next = 8;
                                    return self.elements();

                                case 8:
                                    elems = _context4.sent;

                                    ptr = new HostArray(elems).buffer;

                                case 10:
                                    assert(Buffer.isBuffer(ptr), 'Argument "ptr" is not a Buffer.');
                                    _context4.next = 13;
                                    return af.getDataPtr(self, ptr);

                                case 13:
                                    return _context4.abrupt('return', ptr);

                                case 14:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));
            }
            return function (ptr) {
                if (!ptr) {
                    var HostArray = new ArrayType(self.refType());
                    ptr = new HostArray(self.elements()).buffer;
                }
                assert(Buffer.isBuffer(ptr), 'Argument "ptr" is not a Buffer.');
                af.getDataPtr(self, ptr);
                return ptr;
            };
        }
    }, {
        key: '_makeIndex',
        value: function _makeIndex() {
            var self = this;
            var af = this.af;
            if (af.options.async) {
                return async(regeneratorRuntime.mark(function _callee5(idx) {
                    var newHandle;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    _context5.next = 2;
                                    return af.index(self, idx);

                                case 2:
                                    newHandle = _context5.sent;
                                    return _context5.abrupt('return', new AFArray(af, newHandle));

                                case 4:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));
            }
            return function (idx) {
                var newHandle = af.index(self, idx);
                return new AFArray(af, newHandle);
            };
        }
    }, {
        key: '_makeAssign',
        value: function _makeAssign() {
            var self = this;
            var af = this.af;
            if (af.options.async) {
                return async(regeneratorRuntime.mark(function _callee6(idx, value) {
                    var newHandle, otherHandle;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    newHandle = void 0;

                                    if (!(value === undefined)) {
                                        _context6.next = 8;
                                        break;
                                    }

                                    otherHandle = helpers.getHandle(idx);
                                    _context6.next = 5;
                                    return af.retainArray(otherHandle);

                                case 5:
                                    newHandle = _context6.sent;
                                    _context6.next = 11;
                                    break;

                                case 8:
                                    _context6.next = 10;
                                    return af.assign(self, idx, value);

                                case 10:
                                    newHandle = _context6.sent;

                                case 11:
                                    _context6.next = 13;
                                    return self.dispose();

                                case 13:
                                    self.resetDisposable(function () {
                                        return af.releaseArray(newHandle);
                                    });
                                    self.handle = newHandle;

                                case 15:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this);
                }));
            }
            return function (idx, value) {
                var newHandle = void 0;
                if (value === undefined) {
                    var otherHandle = helpers.getHandle(idx);
                    newHandle = af.retainArray(otherHandle);
                } else {
                    newHandle = af.assign(self, idx, value);
                }
                self.dispose();
                self.resetDisposable(function () {
                    return af.releaseArray(newHandle);
                });
                self.handle = newHandle;
            };
        }
    }]);

    return AFArray;
}(Disposable);

module.exports = AFArray;
//# sourceMappingURL=AFArray.js.map