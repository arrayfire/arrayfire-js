'use strict';

var fastcall = require('fastcall');
var ref = fastcall.ref;
var typedefs = require('./typedefs');
var handleType = typedefs.handleType;
var helpers = require('./helpers');
var Promise = require('bluebird');
var async = Promise.coroutine;
var Seq = require('./Seq');
var Col = require('./Col');
var Cols = require('./Cols');
var Row = require('./Row');
var Rows = require('./Rows');
var assert = require('assert');

module.exports = function (af, AFArray) {
    var lib = af._lib;
    var intf = lib.interface;

    var callAssign = null;

    // .get

    lib.declare('int af_index_gen(void** out, void* in, longlong ndims, IndexT* indices)');

    af.index = af._makeFunction(function () {
        this.out = ref.alloc(handleType);
        this.indices = lib.arrays.IndexArray.type(4);
        this.ndims = 0;
    }, function (array) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        parseIndexArgs(this, args);
        return intf.af_index_gen(this.out, helpers.getHandle(array), this.ndims, this.indices);
    }, function () {
        return this.out.deref();
    });

    // .set

    lib.declare('int af_assign_gen(void** out, void* lhs, longlong ndims, IndexT* indices, void* rhs)');

    af.assign = af._makeFunction(function () {
        this.out = ref.alloc(handleType);
        this.indices = lib.arrays.IndexArray.type(4);
        this.ndims = 0;
        this.lhs = null;
        this.rhs = null;
    }, function (array, rhs) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
        }

        parseIndexArgs(this, args);
        return callAssign(this, rhs);
    }, function () {
        return this.out.deref();
    });

    function parseIndexArgs(context, args) {
        for (var _i = 0; _i < args.length; _i++) {
            var arg = args[_i];
            if (arg >= 0) {
                context.indices.set(_i, seqIndex(new Seq(arg)));
            } else if (arg instanceof Seq) {
                context.indices.set(_i, seqIndex(arg));
            } else if (arg === af.span) {
                context.indices.set(_i, seqIndex(new Seq(1, 1, 0)));
            } else if (arg instanceof Row) {
                context.indices.set(_i++, seqIndex(new Seq(arg.index)));
                context.indices.set(_i, seqIndex(new Seq(1, 1, 0)));
            } else if (arg instanceof Rows) {
                context.indices.set(_i++, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
                context.indices.set(_i, seqIndex(new Seq(1, 1, 0)));
            } else if (arg instanceof Col) {
                context.indices.set(_i++, seqIndex(new Seq(1, 1, 0)));
                context.indices.set(_i, seqIndex(new Seq(arg.index)));
            } else if (arg instanceof Cols) {
                context.indices.set(_i++, seqIndex(new Seq(1, 1, 0)));
                context.indices.set(_i, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
            } else {
                // AFArray
                var idx = lib.unions.ArrayOrSeqT({
                    arr: helpers.getHandle(arg)
                });
                var index = lib.structs.IndexT({
                    idx: idx,
                    isSeq: false,
                    isBatch: af._batch
                });
            }
        }

        assert(i > 0 && i <= 4, 'Invalid index arguments.');
        context.ndims = i;

        function seqIndex(seq) {
            var idx = lib.unions.ArrayOrSeqT({
                seq: seq.data
            });
            var index = lib.structs.IndexT({
                idx: idx,
                isSeq: true,
                isBatch: af._batch
            });
            return index;
        }
    }

    if (af.options.async) {
        callAssign = function callAssign(context, rhs) {
            return af.scope.async(regeneratorRuntime.mark(function _callee(context, rhs) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!_.isNumber(rhs)) {
                                    _context.next = 4;
                                    break;
                                }

                                _context.next = 3;
                                return af.constant(af.getDims(context.lhs), rhs);

                            case 3:
                                rhs = _context.sent;

                            case 4:
                                return _context.abrupt('return', intf.af_assign_gen(context.out, helpers.getHandle(context.lhs), context.ndims, context.indices, helpers.getHandle(rhs)));

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    } else {
        callAssign = function callAssign(context, rhs) {
            af.scope(function (context, rhs) {
                if (_.isNumber(rhs)) {
                    rhs = af.constant(af.getDims(context.lhs), rhs);
                }
                return intf.af_assign_gen(context.out, helpers.getHandle(context.lhs), context.ndims, context.indices, helpers.getHandle(rhs));
            });
        };
    }
};
//# sourceMappingURL=arrayIndexing.js.map