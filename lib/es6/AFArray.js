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
                return this.res.unref();
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
                return intf.af_create_handle(this.res, len, dims.data, type);
            },
            function () {
                return this.res.unref();
            });

        // createArray

        lib.declare('int af_create_array(void** outArr, void* data, uint ndims, longlong* dims, int type)');

        af.createArray = af._makeFunction(
            function () {
                this.res = ref.alloc(typedefs.handleType);
            },
            function (data, dims, type = 0) {
                let len = dims ? dims.ndims : 0;
                return intf.af_create_array(this.res, len, dims.data, type);
            },
            function () {
                return this.res.unref();
            });

        // deviceArray

        lib.declare('int af_device_array(void** outArr, void* data, uint ndims, longlong* dims, int type)');

        af.deviceArray = af._makeFunction(
            function () {
                this.res = ref.alloc(typedefs.handleType);
            },
            function (data, dims, type = 0) {
                let len = dims ? dims.ndims : 0;
                return intf.af_device_array(this.res, len, dims.data, type);
            },
            function () {
                return this.res.unref();
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

                if (firstArg instanceof AFArray) {
                    if (argsLen === 1) {
                        // array(otherArray)
                        return af.retainArray(firstArg);
                    }
                    else {
                        // array(otherArray, dims...)
                        return af.moddims(firstArg, helpers.parseDims(arguments, 1));
                    }
                }

                const nextIndex = { value: 0 };
                const dims = helpers.parseDims(arguments, 0, nextIndex);

                if (nextIndex.value === argsLen) {
                    // array(dims..., f32)
                    return af.createHandle(dims, af.dtypeToInt(af.dtype.f32));
                }

                let nextArg = arguments[nextIndex.value];
                if (_.isArray(nextArg)) {
                    nextArg = helpers.arrayToBuffer(nextArg);
                }
                if (Buffer.isBuffer(nextArg)) {
                    let type = af.dtype.f32;
                    let source = af.source.host;
                    let index = nextIndex.value + 1;
                    if (index < argsLen) {
                        type = arguments[index];
                        index++;
                        if (index < argsLen) {
                            source = arguments[index];
                        }
                    }
                    // array(dims..., ptr, [type[, source]])
                    if (source === af.source.host) {
                        return af.createArray(nextArg, dims, af.dtypeToInt(type));
                    }
                    return af.deviceArray(nextArg, dims, af.dtypeToInt(type));
                }

                let type = af.dtype.f32;
                let index = nextIndex.value + 1;
                if (index < argsLen) {
                    type = arguments[index];
                }

                // array(dims...[, type])
                return af.createArray(nextArg, dims, af.dtypeToInt(type));
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
            function (array, n) {
                this.dims = new Dim4();
                this.n = n || -1;
                const dim0 = ref.get(this.dims.data, 0);
                const dim1 = ref.get(this.dims.data, longlong.size);
                const dim2 = ref.get(this.dims.data, longlong.size * 2);
                const dim3 = ref.get(this.dims.data, longlong.size * 3);
                return intf.af_get_dims(dim0, dim1, dim2, dim3, helpers.getHandle(array));
            },
            function () {
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

        lib.declare('int af_get_type(int* outType, void *arr)');

        af.getType = af._makeFunction(
            function () {
                this.outType = ref.alloc(ref.types.int);
            },
            function (array) {
                return intf.af_get_type(this.outType, helpers.getHandle(array));
            },
            function () {
                return af.intToDtype(this.outType.deref());
            });

        af.getRefType = af._makeFunction(
            function (array) {
                return af.getType(array);
            },
            function (type) {
                return af.dtypeToRefType(type);
            });

        // getNumdims

        lib.declare('int af_get_numdims(unsigned* outNum, void *arr)');

        af.getNumdims = af._makeFunction(
            function () {
                this.outNum = ref.alloc(ref.types.uint);
            },
            function (array) {
                return intf.af_get_numdims(this.outNum, helpers.getHandle(array));
            },
            function () {
                return af.intToDtype(this.outNum.deref());
            });

        // getElements

        lib.declare('int af_get_elements(longlong* outElems, void *arr)');

        af.getElements = af._makeFunction(
            function () {
                this.outElems = ref.alloc(ref.types.longlong);
            },
            function (array) {
                return intf.af_get_elements(this.outElems, helpers.getHandle(array));
            },
            function () {
                return af.intToDtype(this.outElems.deref());
            });

        // isEmpty

        lib.declare('int af_is_empty(bool* outEmpty, void *arr)');

        af.isEmpty = af._makeFunction(
            function () {
                this.outEmpty = ref.alloc(ref.types.bool);
            },
            function (array) {
                return intf.af_is_empty(this.outEmpty, helpers.getHandle(array));
            },
            function () {
                return af.intToDtype(this.outEmpty.deref());
            });

        // eval

        let hasMultiEval = false;
        let multiEvalEmu = null;
        lib.declare('int af_eval(void* arr)');
        if (lib.hasSymbol('af_eval_multiple')) {
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
        this._get = this._makeGet();
    }

    type() {
        return af.getType(this);
    }

    refType() {
        return af.getRefType(this);
    }

    dims(n) {
        return af.getDims(this, n);
    }

    host(to) {
        return this._host(to);
    }

    numdims() {
        return this.getNumdims(this);
    }

    elements() {
        return af.getElements(this);
    }

    isempty() {
        return af.isEmpty(this);
    }

    eval() {
        return af.eval(this);
    }

    get() {
        return this._get.apply(this, arguments);
    }

    set(...args) {
        const self = this;
        if (af.options.async) {
            return async(function* (rhs) {
                const newHandle = yield af.assign(self, rhs, ...args);
                self.dispose();
                self.resetDisposable(() => af.releaseArray(newHandle));
                self.handle = newHandle;
            });
        }
        return rhs => {
            const newHandle = af.assign(self, rhs, ...args);
            self.dispose();
            self.resetDisposable(() => af.releaseArray(newHandle));
            self.handle = newHandle;
        };
    }

    _makeHost() {
        const self = this;
        if (af.options.async) {
            return async(function* (n) {
                if (!n) {
                    const HostArray = new ArrayType(yield self.refType());
                    n = new HostArray(yield self.elements());
                }
                yield af.getDataPtr(self, n);
                return n;
            });
        }
        return function (n) {
            if (!n) {
                const HostArray = new ArrayType(self.refType());
                n = new HostArray(self.elements());
            }
            af.getDataPtr(self, n);
            return n;
        };
    }

    _makeGet() {
        const self = this;
        if (af.options.async) {
            return async(function* () {
                const newHandle = yield af.index(self, ...arguments);
                return new AFArray(newHandle);
            });
        }
        return function () {
            const newHandle = af.index(self, ...arguments);
            return new AFArray(newHandle);
        };
    }
}

module.exports = AFArray;