"use strict";
var _ = require("lodash");
var assert = require("better-assert");
var testHelpers = {
  testIntfSyncArrDoubleComb: function(af, func) {
    var result;
    var arr1 = new af.AFArray(10, af.dType.f32);
    var arr2 = new af.AFArray(10, af.dType.f32);
    result = func(arr1, arr2);
    assert(result instanceof af.AFArray);
    result = func(arr1, 42);
    assert(result instanceof af.AFArray);
    result = func(42, arr2);
    assert(result instanceof af.AFArray);
    try {
      func(42, {});
      assert(false);
    } catch (e) {
      _.noop(e);
    }
  },
  testIntfSyncArrArr: function(af, func) {
    var arr1 = new af.AFArray(10, af.dType.f32);
    var arr2 = new af.AFArray(10, af.dType.f32);
    var result = func(arr1, arr2);
    assert(result instanceof af.AFArray);
    try {
      func(42, {});
      assert(false);
    } catch (e) {
      _.noop(e);
    }
  },
  testIntfSyncArr: function(af, func) {
    var arr = new af.AFArray(10, af.dType.f32);
    var result = func(arr);
    assert(result instanceof af.AFArray);
    try {
      func({});
      assert(false);
    } catch (e) {
      _.noop(e);
    }
  }
};
module.exports = testHelpers;

//# sourceMappingURL=testHelpers.js.map
