'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const typedefs = require('./typedefs');
const handleType = typedefs.handleType;
const helpers = require('./helpers');
const Promise = require('bluebird');
const async = Promise.coroutine;
const Seq = require('./Seq');
const Col = require('./Col');
const Cols = require('./Cols');
const Row = require('./Row');
const Rows = require('./Rows');
const assert = require('assert');

module.exports = function (af, AFArray) {
    const lib = af._lib;
    const intf = lib.interface;

    let callAssign = null;

    // .get

    lib.declare('int af_index_gen(void** out, void* in, longlong ndims, IndexT* indices)');

    af.index = af._makeFunction(
        function () {
            this.out = ref.alloc(handleType);
            this.indices = lib.arrays.IndexArray.type(4);
            this.ndims = 0;
        },
        function (array, ...args) {
            parseIndexArgs(this, args);
            return intf.af_index_gen(this.out, helpers.getHandle(array), this.ndims, this.indices);
        },
        function () {
            return this.out.deref();
        });

    // .set

    lib.declare('int af_assign_gen(void** out, void* lhs, longlong ndims, IndexT* indices, void* rhs)');

    af.assign = af._makeFunction(
        function () {
            this.out = ref.alloc(handleType);
            this.indices = lib.arrays.IndexArray.type(4);
            this.ndims = 0;
            this.lhs = null;
            this.rhs = null;
        },
        function (array, rhs, ...args) {
            parseIndexArgs(this, args);
            return callAssign(this, rhs);
        },
        function () {
            return this.out.deref();
        });

    function parseIndexArgs(context, args) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg >= 0) {
                context.indices.set(i, seqIndex(new Seq(arg)));
            }
            else if (arg instanceof Seq) {
                context.indices.set(i, seqIndex(arg));
            }
            else if (arg === af.span) {
                context.indices.set(i, seqIndex(new Seq(1, 1, 0)));
            }
            else if (arg instanceof Row) {
                context.indices.set(i++, seqIndex(new Seq(arg.index)));
                context.indices.set(i, seqIndex(new Seq(1, 1, 0)));
            }
            else if (arg instanceof Rows) {
                context.indices.set(i++, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
                context.indices.set(i, seqIndex(new Seq(1, 1, 0)));
            }
            else if (arg instanceof Col) {
                context.indices.set(i++, seqIndex(new Seq(1, 1, 0)));
                context.indices.set(i, seqIndex(new Seq(arg.index)));
            }
            else if (arg instanceof Cols) {
                context.indices.set(i++, seqIndex(new Seq(1, 1, 0)));
                context.indices.set(i, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
            }
            else {
                // AFArray
                const idx = lib.unions.ArrayOrSeqT({
                    arr: helpers.getHandle(arg)
                });
                const index = lib.structs.IndexT({
                    idx: idx,
                    isSeq: false,
                    isBatch: af._batch
                });
            }
        }

        assert(i > 0 && i <= 4, 'Invalid index arguments.');
        context.ndims = i;

        function seqIndex(seq) {
            const idx = lib.unions.ArrayOrSeqT({
                seq: seq.data
            });
            const index = lib.structs.IndexT({
                idx: idx,
                isSeq: true,
                isBatch: af._batch
            });
            return index;
        }
    }

    if (af.options.async) {
        callAssign = function (context, rhs) {
            return af.scope.async(function* (context, rhs) {
                if (_.isNumber(rhs)) {
                    rhs = yield af.constant(af.getDims(context.lhs), rhs);
                }
                return intf.af_assign_gen(context.out, helpers.getHandle(context.lhs), context.ndims, context.indices, helpers.getHandle(rhs));
            });
        };
    }
    else {
        callAssign = function (context, rhs) {
            af.scope(function (context, rhs) {
                if (_.isNumber(rhs)) {
                    rhs = af.constant(af.getDims(context.lhs), rhs);
                }
                return intf.af_assign_gen(context.out, helpers.getHandle(context.lhs), context.ndims, context.indices, helpers.getHandle(rhs));
            });
        };
    }
};