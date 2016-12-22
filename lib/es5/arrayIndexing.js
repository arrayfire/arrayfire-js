'use strict';

var fastcall = require('fastcall');
var ref = fastcall.ref;
var typedefs = require('./typedefs');
var handleType = typedefs.handleType;
var helpers = require('./helpers');
var Promise = require('bluebird');
var async = Promise.coroutine;
var Seq = require('./Seq');
var assert = require('assert');
var Idx = require('./Idx');

module.exports = function (af, AFArray) {
    var lib = af._lib;
    var intf = lib.interface;

    var callAssign = null;

    // .get

    lib.declare('int af_index_gen(void** out, void* in, longlong ndims, IndexT* indices)');

    af.index = af._makeFunction(function () {
        this.out = ref.alloc(handleType);
    }, function (array, idx) {
        idx = asIdx(idx);
        return intf.af_index_gen(this.out, helpers.getHandle(array), idx.ndims, idx.buffer);
    }, function () {
        return this.out.deref();
    });

    // .set

    lib.declare('int af_assign_gen(void** out, void* lhs, longlong ndims, IndexT* indices, void* rhs)');

    af.assign = af._makeFunction(function () {
        this.out = ref.alloc(handleType);
    }, function (array, idx, value) {
        idx = asIdx(idx);
        assert(value !== undefined, 'Argument "value" expected.');
        return callAssign(this.out, helpers.getHandle(array), idx, value);
    }, function () {
        return this.out.deref();
    });

    function asIdx(idx) {
        if (idx instanceof Idx) {
            return idx;
        }
        return af.idx(idx);
    }

    if (af.options.async) {
        callAssign = function callAssign(arrayHandle, idx, value) {
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
        callAssign = function callAssign(out, arrayHandle, idx, value) {
            af.scope(function () {
                var rhs = void 0;
                if (_.isNumber(value)) {
                    rhs = af.constant(af.getDims(arrayHandle), value);
                } else {
                    rhs = helpers.getHandle(value);
                }
                return intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
};
//# sourceMappingURL=arrayIndexing.js.map