'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const ArrayType = fastcall.ArrayType;

const typedefs = exports;

typedefs.handleType = ref.refType('void');
typedefs.outHandleType = ref.refType(typedefs.handleType);
typedefs.DimTArray = new ArrayType('longlong', 4);