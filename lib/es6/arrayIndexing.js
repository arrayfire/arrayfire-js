'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const typedefs = require('./typedefs');
const handleType = typedefs.handleType;
const helpers = require('./helpers');
const Promise = require('bluebird');
const async = Promise.coroutine;
const Seq = require('./Seq');
const assert = require('assert');
const Idx = require('./Idx');
const _ = require('lodash');

module.exports = function (af, AFArray) {
    const lib = af._lib;
    const intf = lib.interface;

    let callAssign = null;

    // index

    lib.declare('int af_index_gen(void** out, void* in, longlong ndims, IndexT* indices)');

    af.index = af._makeFunction(
        function () {
            this.out = ref.alloc(handleType);
        },
        function (array, idx) {
            const _idx = asIdx(idx);
            return intf.af_index_gen(this.out, helpers.getHandle(array), _idx.ndims, _idx.buffer);
        },
        function () {
            return this.out.deref();
        });

    // assign

    lib.declare('int af_assign_gen(void** out, void* lhs, longlong ndims, IndexT* indices, void* rhs)');

    af.assign = af._makeFunction(
        function () {
            this.out = ref.alloc(handleType);
        },
        function (array, idx, value) {
            const _idx = asIdx(idx);
            assert(value !== undefined, 'Argument "value" expected.');
            return callAssign(this.out, helpers.getHandle(array), _idx, value);
        },
        function () {
            return this.out.deref();
        });

    function asIdx(idx) {
        if (idx instanceof Idx) {
            return idx;
        }
        return af.idx(idx);
    }

    if (af.options.async) {
        callAssign = function (out, arrayHandle, idx, value) {
            return af.scope.async(function* () {
                let rhs;
                if (_.isNumber(value)) {
                    rhs = (yield af.constant(value, yield af.getDims(arrayHandle), yield af.getType(arrayHandle))).handle;
                }
                else {
                    rhs = helpers.getHandle(value);
                }
                return intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
    else {
        callAssign = function (out, arrayHandle, idx, value) {
            return af.scope(() => {
                let rhs;
                if (_.isNumber(value)) {
                    // let elems = 0;
                    // if (idx.ndims === 1 && !idx.get(0).isSeq) {
                    //     elems = af.getElements(idx.get(0).idx.arr);
                    // }
                    // else {
                    //     const arrDims = af.getDims(arrayHandle);
                    //     for (let i = 0; i < idx.ndims; i++) {
                    //         const seq = idx.get(0).idx.seq;
                    //         if (seq.step === 0) {
                    //             // span:
                    //             elems += arrDims[i];
                    //         }
                    //         else {
                    //             elems += seq.end - seq.begin + 1;
                    //         }
                    //     }
                    // }
                    // const dims = af.dim4(elems);
                    rhs = af.constant(value, af.getDims(arrayHandle), af.getType(arrayHandle)).handle;
                }
                else {
                    rhs = helpers.getHandle(value);
                }
                return intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
};