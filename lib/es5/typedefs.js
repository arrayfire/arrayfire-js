'use strict';

var fastcall = require('fastcall');
var ref = fastcall.ref;
var ArrayType = fastcall.ArrayType;
var StructType = fastcall.StructType;

var typedefs = exports;

typedefs.handleType = ref.refType('void');
typedefs.outHandleType = ref.refType(typedefs.handleType);
typedefs.DimTArray = new ArrayType('longlong', 4);
typedefs.SeqT = new StructType({
    begin: 'double',
    end: 'double',
    step: 'double'
});

typedefs.define = function (af) {
    var lib = af._lib;

    lib.struct({ SeqT: typedefs.SeqT });

    lib.declare('void*[] PointerArray;' + 'union ArrayOrSeqT { void* arr; SeqT seq; };' + 'struct IndexT { ArrayOrSeqT idx; bool isSeq; bool isBatch; };' + 'IndexT[] IndexArray;');
};
//# sourceMappingURL=typedefs.js.map