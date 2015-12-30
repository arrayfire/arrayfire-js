"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AFArray = (function () {
    function AFArray() {
        _classCallCheck(this, AFArray);
    }

    _createClass(AFArray, [{
        key: "free",
        value: function free() {}
    }, {
        key: "elements",
        value: function elements() {}
    }, {
        key: "host",
        value: function host() {}
    }, {
        key: "copyToHost",
        value: function copyToHost() {}
    }, {
        key: "scalar",
        value: function scalar() {}
    }, {
        key: "value",
        value: function value() {}
    }, {
        key: "write",
        value: function write() {}
    }, {
        key: "type",
        value: function type() {}
    }, {
        key: "dims",
        value: function dims() {}
    }, {
        key: "numdims",
        value: function numdims() {}
    }, {
        key: "numDims",
        value: function numDims() {}
    }, {
        key: "bytes",
        value: function bytes() {}
    }, {
        key: "copy",
        value: function copy() {}
    }, {
        key: "isempty",
        value: function isempty() {}
    }, {
        key: "isEmpty",
        value: function isEmpty() {}
    }, {
        key: "isscalar",
        value: function isscalar() {}
    }, {
        key: "isScalar",
        value: function isScalar() {}
    }, {
        key: "isvector",
        value: function isvector() {}
    }, {
        key: "isVector",
        value: function isVector() {}
    }, {
        key: "isrow",
        value: function isrow() {}
    }, {
        key: "isRow",
        value: function isRow() {}
    }, {
        key: "iscolumn",
        value: function iscolumn() {}
    }, {
        key: "isColumn",
        value: function isColumn() {}
    }, {
        key: "iscomplex",
        value: function iscomplex() {}
    }, {
        key: "isComplex",
        value: function isComplex() {}
    }, {
        key: "isreal",
        value: function isreal() {}
    }, {
        key: "isReal",
        value: function isReal() {}
    }, {
        key: "isdouble",
        value: function isdouble() {}
    }, {
        key: "isDouble",
        value: function isDouble() {}
    }, {
        key: "issingle",
        value: function issingle() {}
    }, {
        key: "isSingle",
        value: function isSingle() {}
    }, {
        key: "isrealfloating",
        value: function isrealfloating() {}
    }, {
        key: "isRealFloating",
        value: function isRealFloating() {}
    }, {
        key: "isfloating",
        value: function isfloating() {}
    }, {
        key: "isFloating",
        value: function isFloating() {}
    }, {
        key: "isinteger",
        value: function isinteger() {}
    }, {
        key: "isInteger",
        value: function isInteger() {}
    }, {
        key: "isbool",
        value: function isbool() {}
    }, {
        key: "isBool",
        value: function isBool() {}
    }, {
        key: "afEval",
        value: function afEval() {}
    }, {
        key: "at",
        value: function at() {}
    }, {
        key: "row",
        value: function row() {}
    }, {
        key: "col",
        value: function col() {}
    }, {
        key: "slice",
        value: function slice() {}
    }, {
        key: "rows",
        value: function rows() {}
    }, {
        key: "cols",
        value: function cols() {}
    }, {
        key: "slices",
        value: function slices() {}
    }, {
        key: "as",
        value: function as() {}
    }, {
        key: "assign",
        value: function assign() {}
    }, {
        key: "set",
        value: function set() {}
    }, {
        key: "add",
        value: function add() {}
    }, {
        key: "addAssign",
        value: function addAssign() {}
    }, {
        key: "sub",
        value: function sub() {}
    }, {
        key: "subAssign",
        value: function subAssign() {}
    }, {
        key: "mul",
        value: function mul() {}
    }, {
        key: "mulAssign",
        value: function mulAssign() {}
    }, {
        key: "div",
        value: function div() {}
    }, {
        key: "divAssign",
        value: function divAssign() {}
    }, {
        key: "bitshiftl",
        value: function bitshiftl() {}
    }, {
        key: "bitShiftL",
        value: function bitShiftL() {}
    }, {
        key: "bitshiftr",
        value: function bitshiftr() {}
    }, {
        key: "bitShiftR",
        value: function bitShiftR() {}
    }, {
        key: "lt",
        value: function lt() {}
    }, {
        key: "gt",
        value: function gt() {}
    }, {
        key: "le",
        value: function le() {}
    }, {
        key: "ge",
        value: function ge() {}
    }, {
        key: "eq",
        value: function eq() {}
    }, {
        key: "neq",
        value: function neq() {}
    }, {
        key: "and",
        value: function and() {}
    }, {
        key: "or",
        value: function or() {}
    }, {
        key: "bitAnd",
        value: function bitAnd() {}
    }, {
        key: "bitOr",
        value: function bitOr() {}
    }, {
        key: "bitXor",
        value: function bitXor() {}
    }, {
        key: "rhsAdd",
        value: function rhsAdd() {}
    }, {
        key: "rhsSub",
        value: function rhsSub() {}
    }, {
        key: "rhsMul",
        value: function rhsMul() {}
    }, {
        key: "rhsDiv",
        value: function rhsDiv() {}
    }, {
        key: "rhsBitshiftl",
        value: function rhsBitshiftl() {}
    }, {
        key: "rhsBitShiftL",
        value: function rhsBitShiftL() {}
    }, {
        key: "rhsBitshiftr",
        value: function rhsBitshiftr() {}
    }, {
        key: "rhsBitShiftR",
        value: function rhsBitShiftR() {}
    }, {
        key: "rhsLt",
        value: function rhsLt() {}
    }, {
        key: "rhsGt",
        value: function rhsGt() {}
    }, {
        key: "rhsLe",
        value: function rhsLe() {}
    }, {
        key: "rhsGe",
        value: function rhsGe() {}
    }, {
        key: "rhsEq",
        value: function rhsEq() {}
    }, {
        key: "rhsNeq",
        value: function rhsNeq() {}
    }, {
        key: "rhsAnd",
        value: function rhsAnd() {}
    }, {
        key: "rhsOr",
        value: function rhsOr() {}
    }, {
        key: "rhsBitAnd",
        value: function rhsBitAnd() {}
    }, {
        key: "rhsBitOr",
        value: function rhsBitOr() {}
    }, {
        key: "rhsBitXor",
        value: function rhsBitXor() {}
    }, {
        key: "neg",
        value: function neg() {}
    }, {
        key: "not",
        value: function not() {}
    }, {
        key: "T",
        value: function T() {}
    }, {
        key: "H",
        value: function H() {}
    }]);

    return AFArray;
})();

AFArray.create = function () {};

module.exports = AFArray;
//# sourceMappingURL=afArray.js.map
