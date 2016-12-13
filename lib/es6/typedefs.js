'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const ArrayType = fastcall.ArrayType;
const StructType = fastcall.StructType;

const typedefs = exports;

typedefs.handleType = ref.refType('void');
typedefs.outHandleType = ref.refType(typedefs.handleType);
typedefs.DimTArray = new ArrayType('longlong', 4);
typedefs.SeqT = new StructType({
    begin: 'double',
    end: 'double',
    step: 'double'
});

typedefs.define = function (af) {
    const lib = af._lib;

    lib.declare('void*[] PointerArray;');
}