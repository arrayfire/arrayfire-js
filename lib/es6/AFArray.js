'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const errors = require('./errors');
const assert = require('assert');
const Disposable = fastcall.Disposable;
const typedefs = require('./typedefs');
const DimTArray = typedefs.DimTArray;

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

        /*
        Libdl.dlsym(ptr, :af_get_dims),
        Libdl.dlsym(ptr, :af_get_data_ptr),
        Libdl.dlsym(ptr, :af_get_type),
        Libdl.dlsym(ptr, :af_get_numdims),
        Libdl.dlsym(ptr, :af_get_elements),
        Libdl.dlsym(ptr, :af_is_empty),
        Libdl.dlsym(ptr, :af_eval),
        */

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

                const nextArg = arguments[nextIndex.value];
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
    }

    constructor(af, handle) {
        super(() => af.releaseArray(handle));

        this.af = af;
        this.handle = handle;
    }
}

module.exports = AFArray;