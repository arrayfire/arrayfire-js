'use strict';
const _ = require('lodash');
const fastcall = require('fastcall');
const ref = fastcall.ref;
const Dim4 = require('./Dim4');
const assert = require('assert');
const typedefs = require('./typedefs');

module.exports = function (af) {
    const lib = af._lib;
    const intf = lib.interface;

    // constant

    lib.declare('int af_constant(void** outArr, double value, uint ndims, longlong* dims, int type)');

    af.constant = af._makeFunction(
        function () {
            this.res = ref.alloc(typedefs.handleType);
        },
        function (value, dims, type = 0) {
            assert(dims instanceof Dim4, 'Argument "dims" is not a Dim4 instance.');
            return intf.af_constant(this.res, value, dims.ndims, dims.buffer, type);
        },
        function () {
            return af.array(ref.deref(this.res));
        });
};