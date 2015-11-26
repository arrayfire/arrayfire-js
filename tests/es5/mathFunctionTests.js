"use strict";
var assert = require("better-assert");
var _ = require("lodash");
var ref = require("ref");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var int = ref.types.int;
var float = ref.types.float;
var testExec = require("./testExec");
var testHelpers = require("./testHelpers");
describe("Math functions", function() {
  testExec.run(function(af) {
    it("should invoke abs", function() {
      testHelpers.testIntfSyncArr(af, af.abs);
    });
    it("should invoke arg", function() {
      testHelpers.testIntfSyncArr(af, af.arg);
    });
    it("should invoke ceil", function() {
      testHelpers.testIntfSyncArr(af, af.ceil);
    });
    it("should invoke floor", function() {
      testHelpers.testIntfSyncArr(af, af.floor);
    });
    it("should invoke hypot", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.hypot);
    });
    it("should invoke max", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.max);
    });
    it("should invoke min", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.min);
    });
    it("should invoke mod", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.mod);
    });
    it("should invoke round", function() {
      testHelpers.testIntfSyncArr(af, af.round);
    });
    it("should invoke sign", function() {
      testHelpers.testIntfSyncArr(af, af.sign);
    });
    it("should invoke trunc", function() {
      testHelpers.testIntfSyncArr(af, af.trunc);
    });
    it("should invoke rem", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.rem);
    });
    it("should invoke acos", function() {
      testHelpers.testIntfSyncArr(af, af.acos);
    });
    it("should invoke asin", function() {
      testHelpers.testIntfSyncArr(af, af.asin);
    });
    it("should invoke atan", function() {
      testHelpers.testIntfSyncArr(af, af.atan);
    });
    it("should invoke atan2", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.atan2);
    });
    it("should invoke cos", function() {
      testHelpers.testIntfSyncArr(af, af.cos);
    });
    it("should invoke sin", function() {
      testHelpers.testIntfSyncArr(af, af.sin);
    });
    it("should invoke tan", function() {
      testHelpers.testIntfSyncArr(af, af.tan);
    });
    it("should invoke cbrt", function() {
      testHelpers.testIntfSyncArr(af, af.cbrt);
    });
    it("should invoke erf", function() {
      testHelpers.testIntfSyncArr(af, af.erf);
    });
    it("should invoke erfc", function() {
      testHelpers.testIntfSyncArr(af, af.erfc);
    });
    it("should invoke exp", function() {
      testHelpers.testIntfSyncArr(af, af.exp);
    });
    it("should invoke expm1", function() {
      testHelpers.testIntfSyncArr(af, af.expm1);
    });
    it("should invoke factorial", function() {
      testHelpers.testIntfSyncArr(af, af.factorial);
    });
    it("should invoke lgamma", function() {
      testHelpers.testIntfSyncArr(af, af.lgamma);
    });
    it("should invoke tgamma", function() {
      testHelpers.testIntfSyncArr(af, af.tgamma);
    });
    it("should invoke log", function() {
      testHelpers.testIntfSyncArr(af, af.log);
    });
    it("should invoke log10", function() {
      testHelpers.testIntfSyncArr(af, af.log10);
    });
    it("should invoke log1p", function() {
      testHelpers.testIntfSyncArr(af, af.log1p);
    });
    it("should invoke pow", function() {
      testHelpers.testIntfSyncArrArr(af, af.pow);
    });
    it("should invoke pow2", function() {
      testHelpers.testIntfSyncArr(af, af.pow2);
    });
    it("should invoke root", function() {
      testHelpers.testIntfSyncArrDoubleComb(af, af.root);
    });
    it("should invoke sqrt", function() {
      testHelpers.testIntfSyncArr(af, af.sqrt);
    });
    it("should invoke sigmoid", function() {
      testHelpers.testIntfSyncArr(af, af.sigmoid);
    });
    it("should invoke acosh", function() {
      testHelpers.testIntfSyncArr(af, af.acosh);
    });
    it("should invoke asinh", function() {
      testHelpers.testIntfSyncArr(af, af.asinh);
    });
    it("should invoke atanh", function() {
      testHelpers.testIntfSyncArr(af, af.atanh);
    });
    it("should invoke cosh", function() {
      testHelpers.testIntfSyncArr(af, af.cosh);
    });
    it("should invoke sinh", function() {
      testHelpers.testIntfSyncArr(af, af.sinh);
    });
    it("should invoke complex", function() {
      testHelpers.testIntfSyncArr(af, af.complex);
    });
    it("should invoke conjg", function() {
      testHelpers.testIntfSyncArr(af, af.conjg);
    });
    it("should invoke imag", function() {
      testHelpers.testIntfSyncArr(af, af.imag);
    });
    it("should invoke real", function() {
      testHelpers.testIntfSyncArr(af, af.real);
    });
  });
});

//# sourceMappingURL=mathFunctionTests.js.map
