'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const errors = require('./errors');
const assert = require('assert');
const Disposable = fastcall.Disposable;
const typedefs = require('./typedefs');
const DimTArray = typedefs.DimTArray;
const Dim4 = require('./Dim4');
const longlong = ref.types.longlong;
const Promise = require('bluebird');
const async = Promise.coroutine;
const ArrayType = fastcall.ArrayType;
const arrayIndexing = require('./arrayIndexing');
const _ = require('lodash');
const helpers = require('./helpers');

class AFArray extends Disposable {
    static define(af) {
        const lib = af._lib;
        const intf = lib.interface;

        // retainArray

        lib.declare('int af_retain_array(void** outArr, void* arr)');

        af.retainArray = af._makeFunction(
            function () {
                this.res = ref.alloc(typedefs.handleType);
            },
            function (array) {
                return intf.af_retain_array(this.res, helpers.getHandle(array));
            },
            function () {
                return ref.deref(this.res);
            });

        // releaseArray

        lib.declare('int af_release_array(void* arr)');

        af.releaseArray = af._makeFunction(
            function (array) {
                return intf.af_release_array(helpers.getHandle(array));
            });

        // createHandle

        lib.declare('int af_create_handle(void** outArr, uint ndims, longlong* dims, int type)');

        af.createHandle = af._makeFunction(
            function () {
                this.res = ref.alloc(typedefs.handleType);
            },
            function (dims = null, type = 0) {
                let len = dims ? dims.ndims : 0;
                return intf.af_create_handle(this.res, len, dims.buffer, type);
            },
            function () {
                return ref.deref(this.res);
            });

        // createArray

        lib.declare('int af_create_array(void** outArr, void* data, uint ndims, longlong* dims, int type)');

        af.createArray = af._makeFunction(
            function () {
                this.res = ref.alloc(typedefs.handleType);
            },
            function (data, dims, type = af.dtype.f32) {
                let len = dims ? dims.ndims : 0;
                try {
                    return intf.af_create_array(this.res, helpers.toBuffer(data), len, dims.buffer, type);
                }
                catch (err) {
                    if (err instanceof TypeError) {
                        throw new TypeError('Argument "data" is not a Buffer.');
                    }
                    throw err;
                }
            },
            function () {
                return ref.deref(this.res);
            });

        // deviceArray

        lib.declare('int af_device_array(void** outArr, void* data, uint ndims, longlong* dims, int type)');

        af.deviceArray = af._makeFunction(
            function () {
                this.res = ref.alloc(typedefs.handleType);
            },
            function (data, dims, type = 0) {
                let len = dims ? dims.ndims : 0;
                assert(Buffer.isBuffer(data), 'Argument "data" is not a Buffer.');
                return intf.af_device_array(this.res, data, len, dims.buffer, type);
            },
            function () {
                return ref.deref(this.res);
            });

        // ctors

        af.array = af._makeFunction(
            function () {
                const argsLen = arguments.length;

                // array()
                if (argsLen === 0) {
                    return intf.createHandle();
                }

                const firstArg = arguments[0];

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
                    }
                    else {
                        // array(otherArray, dims...)
                        const secondArg = arguments[1];
                        assert(secondArg instanceof Dim4, 'Second argument is not a dimension.');
                        return af.moddims(firstArg, arguments[1]);
                    }
                }

                const dims = af.dim4(firstArg);

                assert(dims.ndims > 0, 'First argument is not a dimension.');

                if (argsLen === 1) {
                    // array(dims..., f32)
                    return af.createHandle(dims, af.dtype.f32);
                }

                let secondArg = arguments[1];
                let thirdArg = argsLen >= 3 ? arguments[2] : null;

                if (Buffer.isBuffer(secondArg)) {
                    let type = af.dtype.f32;
                    let source = af.source.host;
                    let index = 2;
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
                    const len = jsArray.length;
                    const type = af.dtypeToRefType(dtype);
                    const buff = new Buffer(len * type.size);
                    for (let i = 0; i < len; i++) {
                        type.set(buff, i * type.size, jsArray[i]);
                    }
                    return buff;
                }

                // array(dims...[, type])
                assert(secondArg >= 0 && secondArg <= af.dtype.u16, 'Second argument is not a dtype.');
                return af.createHandle(dims, secondArg);
            },
            function (handle) {
                return new AFArray(af, handle);
            });

        // getDims

        lib.declare('int af_get_dims(longlong* dim0, longlong* dim1, longlong* dim2, longlong* dim3, void* arr)');

        af.getDims = af._makeFunction(
            function () {
                this.dims = null;
                this.n = -1;
            },
            function (array, n = -1) {
                this.dims = new Dim4();
                this.n = n;
                const buff = this.dims.buffer;
                const dim0 = buff.slice(0);
                const dim1 = buff.slice(longlong.size);
                const dim2 = buff.slice(longlong.size * 2);
                const dim3 = buff.slice(longlong.size * 3);
                return intf.af_get_dims(dim0, dim1, dim2, dim3, helpers.getHandle(array));
            },
            function () {
                const n = this.n;
                if (n >= 0 && n < 4) {
                    return this.dims[n];
                }
                return this.dims;
            });

        // getDataPtr

        lib.declare('int af_get_data_ptr(void* ptr, void* arr)');

        af.getDataPtr = af._makeFunction(
            function (array, ptr) {
                return intf.af_get_data_ptr(ptr, helpers.getHandle(array));
            });

        // getType

        lib.declare('int af_get_type(uint* outType, void* arr)');

        af.getType = af._makeFunction(
            function () {
                this.outType = ref.alloc(ref.types.uint);
            },
            function (array) {
                return intf.af_get_type(this.outType, helpers.getHandle(array));
            },
            function () {
                return this.outType.deref();
            });

        af.getRefType = af._makeFunction(
            {
                verify: false,
                call(array) {
                    return af.getType(array);
                },
                done(type) {
                    return af.dtypeToRefType(type);
                }
            });

        // getNumdims

        lib.declare('int af_get_numdims(uint* outNum, void* arr)');

        af.getNumdims = af._makeFunction(
            function () {
                this.outNum = ref.alloc(ref.types.uint);
            },
            function (array) {
                return intf.af_get_numdims(this.outNum, helpers.getHandle(array));
            },
            function () {
                return this.outNum.deref();
            });

        // getElements

        lib.declare('int af_get_elements(longlong* outElems, void* arr)');

        af.getElements = af._makeFunction(
            function () {
                this.outElems = ref.alloc(ref.types.longlong);
            },
            function (array) {
                return intf.af_get_elements(this.outElems, helpers.getHandle(array));
            },
            function () {
                return this.outElems.deref();
            });

        // isEmpty

        lib.declare('int af_is_empty(bool* outEmpty, void* arr)');

        af.isEmpty = af._makeFunction(
            function () {
                this.outEmpty = ref.alloc(ref.types.bool);
            },
            function (array) {
                return intf.af_is_empty(this.outEmpty, helpers.getHandle(array));
            },
            function () {
                return this.outEmpty.deref();
            });

        // eval

        let hasMultiEval = false;
        let multiEvalEmu = null;
        lib.declare('int af_eval(void* arr)');
        if (lib.isSymbolExists('af_eval_multiple')) {
            lib.declare('int af_eval_multiple(int num, PointerArray arrays)');
            hasMultiEval = true;
        }
        else {
            multiEvalEmu = async(function* (arrays, len) {
                for (let i = 0; i < len; i++) {
                    const res = yield intf.af_eval(helpers.getHandle(arr[i]));
                    if (res > 0) {
                        return res;
                    }
                }
                return 0;
            });
        }

        af.eval = af._makeFunction(
            function () {
                this.pointers = new lib.arrays.PointerArray(10);
            },
            function (arr) {
                if (_.isArray(arr)) {
                    len = Math.min(10, arr.length);
                    if (!len) {
                        return 0;
                    }
                    if (hasMultiEval) {
                        for (let i = 0; i < len; i++) {
                            this.pointers.set(i, helpers.getHandle(arr[i]));
                        }
                        return intf.af_eval_multiple(len, this.pointers);
                    }
                    else if (af.options.async) {
                        return multiEvalEmu(arr, len);
                    }
                    else {
                        for (let i = 0; i < len; i++) {
                            const res = intf.af_eval(helpers.getHandle(arr[i]));
                            if (res > 0) {
                                return res;
                            }
                        }
                        return 0;
                    }
                }
                else {
                    return intf.af_eval(helpers.getHandle(arr));
                }
            });

        // index + assign

        arrayIndexing(af, AFArray);
    }

    constructor(af, handle) {
        super(() => af.releaseArray(handle));

        this.af = af;
        this.handle = handle;
        this._host = this._makeHost();
        this._toArray = this._makeToArray();
        this._toRefArray = this._makeToRefArray();
        this._index = this._makeIndex();
        this._assign = this._makeAssign();
    }

    type() {
        return this.af.getType(this);
    }

    refType() {
        return this.af.getRefType(this);
    }

    dims(n) {
        return this.af.getDims(this, n);
    }

    host(ptr) {
        return this._host(ptr);
    }

    toRefArray() {
        return this._toRefArray();
    }

    toArray() {
        return this._toArray();
    }

    numdims() {
        return this.af.getNumdims(this);
    }

    elements() {
        return this.af.getElements(this);
    }

    isempty() {
        return this.af.isEmpty(this);
    }

    eval() {
        return this.af.eval(this);
    }

    index(idx) {
        return this._index(idx);
    }

    assign(idx, value) {
        return this._assign(idx, value);
    }

    _makeToArray() {
        const self = this;
        const af = this.af;
        if (af.options.async) {
            return async(function* (ptr) {
                return refArrayToArray(yield self.toRefArray());
            });
        }
        return function () {
            return refArrayToArray(self.toRefArray());
        };

        function refArrayToArray(refArr) {
            const arr = new Array(refArr.length);
            for (let i = 0; i < refArr.length; i++) {
                arr[i] = refArr.get(i);
            }
            return arr;
        }
    }

    _makeToRefArray() {
        const self = this;
        const af = this.af;
        if (af.options.async) {
            return async(function* (ptr) {
                const HostArray = new ArrayType(self.refType());
                const arr = new HostArray(self.elements());
                yield af.getDataPtr(self, arr.buffer);
                return arr;
            });
        }
        return function () {
            const HostArray = new ArrayType(self.refType());
            const arr = new HostArray(self.elements());
            af.getDataPtr(self, arr.buffer);
            return arr;
        };
    }

    _makeHost() {
        const self = this;
        const af = this.af;
        if (af.options.async) {
            return async(function* (ptr) {
                if (!ptr) {
                    const HostArray = new ArrayType(yield self.refType());
                    const elems = yield self.elements();
                    ptr = new HostArray(elems).buffer;
                }
                assert(Buffer.isBuffer(ptr), 'Argument "ptr" is not a Buffer.');
                yield af.getDataPtr(self, ptr);
                return ptr;
            });
        }
        return function (ptr) {
            if (!ptr) {
                const HostArray = new ArrayType(self.refType());
                ptr = new HostArray(self.elements()).buffer;
            }
            assert(Buffer.isBuffer(ptr), 'Argument "ptr" is not a Buffer.');
            af.getDataPtr(self, ptr);
            return ptr;
        };
    }

    _makeIndex() {
        const self = this;
        const af = this.af;
        if (af.options.async) {
            return async(function* (idx) {
                const newHandle = yield af.index(self, idx);
                return new AFArray(af, newHandle);
            });
        }
        return function (idx) {
            const newHandle = af.index(self, idx);
            return new AFArray(af, newHandle);
        };
    }

    _makeAssign() {
        const self = this;
        const af = this.af;
        if (af.options.async) {
            return async(function* (idx, value) {
                let newHandle;
                if (value === undefined) {
                    const otherHandle = helpers.getHandle(idx);
                    newHandle = yield af.retainArray(otherHandle);
                }
                else {
                    newHandle = yield af.assign(self, idx, value);
                }
                yield self.dispose();
                self.resetDisposable(() => af.releaseArray(newHandle));
                self.handle = newHandle;
            });
        }
        return function (idx, value) {
            let newHandle;
            if (value === undefined) {
                const otherHandle = helpers.getHandle(idx);
                newHandle = af.retainArray(otherHandle);
            }
            else {
                newHandle = af.assign(self, idx, value);
            }
            self.dispose();
            self.resetDisposable(() => af.releaseArray(newHandle));
            self.handle = newHandle;
        };
    }
}

module.exports = AFArray;