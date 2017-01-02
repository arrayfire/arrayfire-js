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
var _ = require('lodash');

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
        callAssign = function callAssign(out, arrayHandle, idx, value) {
            return af.scope.async(regeneratorRuntime.mark(function _callee() {
                var rhs;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                rhs = void 0;

                                if (!_.isNumber(value)) {
                                    _context.next = 15;
                                    break;
                                }

                                _context.t0 = af;
                                _context.t1 = value;
                                _context.next = 6;
                                return af.getDims(arrayHandle);

                            case 6:
                                _context.t2 = _context.sent;
                                _context.next = 9;
                                return af.getType(arrayHandle);

                            case 9:
                                _context.t3 = _context.sent;
                                _context.next = 12;
                                return _context.t0.constant.call(_context.t0, _context.t1, _context.t2, _context.t3);

                            case 12:
                                rhs = _context.sent.handle;
                                _context.next = 16;
                                break;

                            case 15:
                                rhs = helpers.getHandle(value);

                            case 16:
                                return _context.abrupt('return', intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs));

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    } else {
        callAssign = function callAssign(out, arrayHandle, idx, value) {
            return af.scope(function () {
                var rhs = void 0;
                if (_.isNumber(value)) {
                    rhs = af.constant(value, af.getDims(arrayHandle), af.getType(arrayHandle)).handle;
                } else {
                    rhs = helpers.getHandle(value);
                }
                return intf.af_assign_gen(out, arrayHandle, idx.ndims, idx.buffer, rhs);
            });
        };
    }
};
//# sourceMappingURL=arrayIndexing.js.map