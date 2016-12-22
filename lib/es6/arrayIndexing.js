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

module.exports = function (af, AFArray) {
    const lib = af._lib;
    const intf = lib.interface;

    let callAssign = null;

    // .get

    lib.declare('int af_index_gen(void** out, void* in, longlong ndims, IndexT* indices)');

    af.index = af._makeFunction(
        function () {
            this.out = ref.alloc(handleType);
        },
        function (array, idx) {
            idx = asIdx(idx);
            return intf.af_index_gen(this.out, helpers.getHandle(array), idx.ndims, idx.buffer);
        },
        function () {
            return this.out.deref();
        });

    // .set

    lib.declare('int af_assign_gen(void** out, void* lhs, longlong ndims, IndexT* indices, void* rhs)');

    af.assign = af._makeFunction(
        function () {
            this.out = ref.alloc(handleType);
        },
        function (array, idx, value) {
            idx = asIdx(idx);
            assert(value !== undefined, 'Argument "value" expected.');
            return callAssign(this.out, helpers.getHandle(array), idx, value);
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
        callAssign = function (arrayHandle, idx, value) {
            return af.scope.async(function* (context, rhs) {
                if (_.isNumber(rhs)) {
                    rhs = yield af.constant(af.getDims(context.lhs), rhs);
                }
                return intf.af_assign_gen(context.out, helpers.getHandle(context.lhs), context.ndims, context.indices, helpers.getHandle(rhs));
            });
        };
    }
    else {
        callAssign = function (out, arrayHandle, idx, value) {
            af.scope(() => {
                let rhs;
                if (_.isNumber(value)) {
                    rhs = af.constant(af.getDims(arrayHandle), value);
                }
                else {
                    rhs = helpers.getHandle(value);
                }
                return intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
};