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
                    let dims;
                    if (idx.ndims === 1 && !idx.get(0).isSeq) {
                        const elems = yield af.getElements(idx.get(0).idx.arr);
                        dims = af.dim4(elems);
                    }
                    else {
                        let arrDims = null;
                        const getArrDims = async(function* () {
                            if (arrDims === null) {
                                arrDims = yield af.getDims(arrayHandle);
                            }
                            return arrDims;
                        });
                        dims = af.dim4(1, 1, 1, 1);
                        for (let i = 0; i < idx.ndims; i++) {
                            const seq = idx.get(i).idx.seq;
                            if (seq.step === 0) {
                                // span:
                                dims[i] = (yield getArrDims())[i];
                            }
                            else {
                                dims[i] = seq.end - seq.begin + 1;
                            }
                        }
                    }
                    rhs = yield af.constant(value, dims, yield af.getType(arrayHandle)).handle;
                }
                else {
                    rhs = helpers.getHandle(value);
                }
                return yield intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
    else {
        callAssign = function (out, arrayHandle, idx, value) {
            return af.scope(() => {
                let rhs;
                if (_.isNumber(value)) {
                    let dims;
                    if (idx.ndims === 1 && !idx.get(0).isSeq) {
                        const elems = af.getElements(idx.get(0).idx.arr);
                        dims = af.dim4(elems);
                    }
                    else {
                        let arrDims = null;
                        const getArrDims = () => {
                            if (arrDims === null) {
                                arrDims = af.getDims(arrayHandle);
                            }
                            return arrDims;
                        };
                        dims = af.dim4(1, 1, 1, 1);
                        for (let i = 0; i < idx.ndims; i++) {
                            const seq = idx.get(i).idx.seq;
                            if (seq.step === 0) {
                                // span:
                                dims[i] = getArrDims()[i];
                            }
                            else {
                                dims[i] = seq.end - seq.begin + 1;
                            }
                        }
                    }
                    rhs = af.constant(value, dims, af.getType(arrayHandle)).handle;
                }
                else {
                    rhs = helpers.getHandle(value);
                }
                return intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
};