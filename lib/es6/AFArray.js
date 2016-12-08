'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const errors = require('./errors');
const assert = require('assert');
const Disposable = fastcall.Disposable;

const handleType = ref.refType('void');

class AFArray extends Disposable {
    static define(af) {
        const lib = af._lib;
        const intf = lib.interface;

        // Dims[]

        lib.declare('longlong[] Dims');

        // _releaseArray

        lib.declare('int af_release_array(void* arr)');

        af._releaseArray = af._makeFunction(
            function (array) {
                return intf.af_release_array(getHandle(array));
            });

        // _createHandle

        lib.declare('int af_create_handle(void* arr, uint ndims, Dims[] dims, int type)');

        af._createHandle = af._makeFunction(
            function () {
                this.dims = lib.arrays.Dims.type(4);
                this.res = ref.alloc(handleType);
            },
            function (dims = null, type = 0) {
                let len = 0;
                if (dims) {
                    len = Math.min(4, dims.length);
                    for (let i = 0; i < len; i++) {
                        this.dims.set(i, dims[i]);
                    }
                }
                return intf.af_create_handle(this.res, len, this.dims, type);
            },
            function () {
                return this.res.unref();
            });

        /*
        Libdl.dlsym(ptr, :af_create_array),
        Libdl.dlsym(ptr, :af_retain_array),
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
                    return intf._createHandle();
                }
            },
            function (handle) {
                return new AFArray(af, handle);
            });
    }

    constructor(af, handle) {
        super(() => af._releaseArray(handle));

        this.af = af;
        this.handle = handle;      
    }
};

module.exports = AFArray;

// helpers:

function getHandle(array) {
    if (array.handle) {
        return array.handle;
    }
    return array;
}