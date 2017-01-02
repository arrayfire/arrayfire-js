'use strict';

var _ = require('lodash');
var fastcall = require('fastcall');
var ref = fastcall.ref;
var Dim4 = require('./Dim4');
var assert = require('assert');
var typedefs = require('./typedefs');

module.exports = function (af) {
    var lib = af._lib;
    var intf = lib.interface;

    // constant

    lib.declare('int af_constant(void** outArr, double value, uint ndims, longlong* dims, int type)');

    af.constant = af._makeFunction(function () {
        this.res = ref.alloc(typedefs.handleType);
    }, function (value, dims) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        assert(dims instanceof Dim4, 'Argument "dims" is not a Dim4 instance.');
        return intf.af_constant(this.res, value, dims.ndims, dims.buffer, type);
    }, function () {
        return af.array(ref.deref(this.res));
    });
};
//# sourceMappingURL=create.js.map