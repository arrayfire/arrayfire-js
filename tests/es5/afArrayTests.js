"use strict";
var assert = require("better-assert");
var _ = require("lodash");
var ref = require("ref");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
function testPlatform(id) {
  if (process.env["TEST_" + id] === "1") {
    describe(id + " platform", function() {
      var af = require("../..")(id);
      var AFArray = af.AFArray;
      it("should export AFArray constructor", function() {
        assert(_.isFunction(AFArray));
      });
      it("should create empty", function() {
        var array = new AFArray();
        assert(_.isObject(array));
        assert(array.bytes() === 0);
        assert(array.elements() === 0);
        assert(array.isempty());
        assert(_.isFunction(array.host));
        assert(_.isFunction(array.hostAsync));
        assert(_.isUndefined(array.hostAsyncAsync));
        assert(_.isFunction(array.hostSync));
        assert(_.isUndefined(array.hostSyncAsync));
        assert(_.isUndefined(array.hostSyncSync));
        assert(_.isUndefined(array.hostAsyncSync));
      });
      it("should fail with one number argument", function() {
        try {
          var array = new AFArray(1);
          assert(false);
        } catch (e) {}
      });
      it("should create new one dimensional", function() {
        var array = new AFArray(10, af.dType.s32);
        assert(_.isObject(array));
        assert(array.bytes() === 10 * 4);
        assert(array.elements() === 10);
        assert(array.type() === af.dType.s32);
        assert(array.numdims() === 1);
        assert(array.dims(0) === 10);
        assert(array.dims(1) === 1);
        assert(array.dims(2) === 1);
        assert(array.dims(3) === 1);
        var dims = array.dims();
        assert(_.isObject(dims));
        assert(dims.elements === 10);
        assert(dims.ndims === 1);
        assert(dims.values[0] === 10);
        assert(dims.values[1] === 1);
        assert(dims.values[2] === 1);
        assert(dims.values[3] === 1);
        assert(array.isempty() === false);
        assert(array.isscalar() === false);
        assert(array.isvector() === true);
        assert(array.isrow() === false);
        assert(array.iscolumn() === true);
        assert(array.iscomplex() === false);
        assert(array.isreal() === true);
        assert(array.isdouble() === false);
        assert(array.issingle() === false);
        assert(array.isrealfloating() === false);
        assert(array.isfloating() === false);
        assert(array.isinteger() === true);
        assert(array.isbool() === false);
      });
      it("should create new two dimensional", function() {
        var array = new AFArray(10, 20, af.dType.f32);
        assert(_.isObject(array));
        assert(array.bytes() === 10 * 20 * 4);
        assert(array.elements() === 10 * 20);
        assert(array.type() === af.dType.f32);
        assert(array.numdims() === 2);
        assert(array.dims(0) === 10);
        assert(array.dims(1) === 20);
        assert(array.dims(2) === 1);
        assert(array.dims(3) === 1);
        var dims = array.dims();
        assert(_.isObject(dims));
        assert(dims.elements === 10 * 20);
        assert(dims.ndims === 2);
        assert(dims.values[0] === 10);
        assert(dims.values[1] === 20);
        assert(dims.values[2] === 1);
        assert(dims.values[3] === 1);
        assert(array.isempty() === false);
        assert(array.isscalar() === false);
        assert(array.isvector() === false);
        assert(array.isrow() === false);
        assert(array.iscolumn() === false);
        assert(array.iscomplex() === false);
        assert(array.isreal() === true);
        assert(array.isdouble() === false);
        assert(array.issingle() === true);
        assert(array.isrealfloating() === true);
        assert(array.isfloating() === true);
        assert(array.isinteger() === false);
        assert(array.isbool() === false);
      });
      it("should create new three dimensional", function() {
        var array = new AFArray(10, 20, 30, af.dType.f32);
        assert(_.isObject(array));
        assert(array.bytes() === 10 * 20 * 30 * 4);
        assert(array.elements() === 10 * 20 * 30);
        assert(array.type() === af.dType.f32);
        assert(array.numdims() === 3);
        assert(array.dims(0) === 10);
        assert(array.dims(1) === 20);
        assert(array.dims(2) === 30);
        assert(array.dims(3) === 1);
        var dims = array.dims();
        assert(_.isObject(dims));
        assert(dims.elements === 10 * 20 * 30);
        assert(dims.ndims === 3);
        assert(dims.values[0] === 10);
        assert(dims.values[1] === 20);
        assert(dims.values[2] === 30);
        assert(dims.values[3] === 1);
        assert(array.isempty() === false);
        assert(array.isscalar() === false);
        assert(array.isvector() === false);
        assert(array.isrow() === false);
        assert(array.iscolumn() === false);
        assert(array.iscomplex() === false);
        assert(array.isreal() === true);
        assert(array.isdouble() === false);
        assert(array.issingle() === true);
        assert(array.isrealfloating() === true);
        assert(array.isfloating() === true);
        assert(array.isinteger() === false);
        assert(array.isbool() === false);
      });
      function verify4(array) {
        assert(_.isObject(array));
        assert(array.bytes() === 10 * 20 * 30 * 40 * 4);
        assert(array.elements() === 10 * 20 * 30 * 40);
        assert(array.type() === af.dType.f32);
        assert(array.numdims() === 4);
        assert(array.dims(0) === 10);
        assert(array.dims(1) === 20);
        assert(array.dims(2) === 30);
        assert(array.dims(3) === 40);
        var dims = array.dims();
        assert(_.isObject(dims));
        assert(dims.elements === 10 * 20 * 30 * 40);
        assert(dims.ndims === 4);
        assert(dims.values[0] === 10);
        assert(dims.values[1] === 20);
        assert(dims.values[2] === 30);
        assert(dims.values[3] === 40);
        assert(array.isempty() === false);
        assert(array.isscalar() === false);
        assert(array.isvector() === false);
        assert(array.isrow() === false);
        assert(array.iscolumn() === false);
        assert(array.iscomplex() === false);
        assert(array.isreal() === true);
        assert(array.isdouble() === false);
        assert(array.issingle() === true);
        assert(array.isrealfloating() === true);
        assert(array.isfloating() === true);
        assert(array.isinteger() === false);
        assert(array.isbool() === false);
      }
      it("should create new four dimensional", function() {
        var array = new AFArray(10, 20, 30, 40, af.dType.f32);
        verify4(array);
      });
      it("should create new four dimensional from dim4", function() {
        var array = new AFArray({values: [10, 20, 30, 40]}, af.dType.f32);
        verify4(array);
      });
      it("should create new four dimensional from dim4 array", function() {
        var array = new AFArray([10, 20, 30, 40], af.dType.f32);
        verify4(array);
      });
      it("should initialize from buffer, copyable, and readable - asynchronously w/ generators", function(done) {
        var f = async($traceurRuntime.initGeneratorFunction(function $__11() {
          var int,
              count,
              buff,
              v$__1,
              array,
              buff2,
              v$__2,
              v1,
              v2,
              array2,
              buff3,
              v$__3,
              v1$__4,
              v2$__5,
              v;
          return $traceurRuntime.createGeneratorInstance(function($ctx) {
            while (true)
              switch ($ctx.state) {
                case 0:
                  int = ref.types.int;
                  count = 10;
                  buff = new Buffer(int.size * count);
                  for (v$__1 = 0; v$__1 < count; v$__1++) {
                    int.set(buff, v$__1 * int.size, v$__1 * v$__1);
                  }
                  assert(_.isFunction(AFArray.create));
                  assert(_.isFunction(AFArray.createAsync));
                  $ctx.state = 34;
                  break;
                case 34:
                  $ctx.state = 2;
                  return AFArray.createAsync(count, af.dType.s32, buff);
                case 2:
                  array = $ctx.sent;
                  $ctx.state = 4;
                  break;
                case 4:
                  assert(array.bytes() === count * int.size);
                  assert(array.type() === af.dType.s32);
                  buff2 = new Buffer(int.size * count);
                  $ctx.state = 36;
                  break;
                case 36:
                  $ctx.state = 6;
                  return array.hostAsync(buff2);
                case 6:
                  $ctx.maybeThrow();
                  $ctx.state = 8;
                  break;
                case 8:
                  for (v$__2 = 0; v$__2 < count; v$__2++) {
                    v1 = int.get(buff, v$__2 * int.size);
                    v2 = int.get(buff2, v$__2 * int.size);
                    assert(v1 === v2);
                    assert(v1 === v$__2 * v$__2);
                  }
                  array2 = array.copy();
                  assert(array2 instanceof AFArray);
                  assert(array2.bytes() === array.bytes());
                  $ctx.state = 38;
                  break;
                case 38:
                  $ctx.state = 10;
                  return array2.hostAsync();
                case 10:
                  buff3 = $ctx.sent;
                  $ctx.state = 12;
                  break;
                case 12:
                  assert(buff3 instanceof Buffer);
                  assert(buff3.length === int.size * count);
                  for (v$__3 = 0; v$__3 < count; v$__3++) {
                    v1$__4 = int.get(buff, v$__3 * int.size);
                    v2$__5 = int.get(buff3, v$__3 * int.size);
                    assert(v1$__4 === v2$__5);
                    assert(v1$__4 === v$__3 * v$__3);
                  }
                  $ctx.state = 40;
                  break;
                case 40:
                  $ctx.state = 14;
                  return array2.valueAsync();
                case 14:
                  v = $ctx.sent;
                  $ctx.state = 16;
                  break;
                case 16:
                  assert(v === 0.0);
                  $ctx.state = 42;
                  break;
                case 42:
                  $ctx.state = 18;
                  return array2.at(1).valueAsync();
                case 18:
                  v = $ctx.sent;
                  $ctx.state = 20;
                  break;
                case 20:
                  assert(v === 1.0);
                  $ctx.state = 44;
                  break;
                case 44:
                  $ctx.state = 22;
                  return array2.at(2).scalarAsync();
                case 22:
                  v = $ctx.sent;
                  $ctx.state = 24;
                  break;
                case 24:
                  assert(v === 4.0);
                  $ctx.state = 46;
                  break;
                case 46:
                  $ctx.state = 26;
                  return array2.at("end").scalarAsync();
                case 26:
                  v = $ctx.sent;
                  $ctx.state = 28;
                  break;
                case 28:
                  assert(v === 9.0 * 9.0);
                  $ctx.state = 48;
                  break;
                case 48:
                  $ctx.state = 30;
                  return array2.at(af.end - 1).scalarAsync();
                case 30:
                  v = $ctx.sent;
                  $ctx.state = 32;
                  break;
                case 32:
                  assert(v === 8.0 * 8.0);
                  $ctx.state = -2;
                  break;
                default:
                  return $ctx.end();
              }
          }, $__11, this);
        }));
        f().nodeify(done);
      });
      it("should initialize from buffer, copyable, and readable - synchronously (blocking)", function() {
        var int = ref.types.int;
        var count = 10;
        var buff = new Buffer(int.size * count);
        for (var v$__6 = 0; v$__6 < count; v$__6++) {
          int.set(buff, v$__6 * int.size, v$__6 * v$__6);
        }
        assert(_.isFunction(AFArray.create));
        assert(_.isFunction(AFArray.createSync));
        var array = AFArray.createSync(count, af.dType.s32, buff);
        assert(array.bytes() === count * int.size);
        assert(array.type() === af.dType.s32);
        var buff2 = new Buffer(int.size * count);
        array.hostSync(buff2);
        for (var v$__7 = 0; v$__7 < count; v$__7++) {
          var v1 = int.get(buff, v$__7 * int.size);
          var v2 = int.get(buff2, v$__7 * int.size);
          assert(v1 === v2);
          assert(v1 === v$__7 * v$__7);
        }
        var array2 = array.copy();
        assert(array2 instanceof AFArray);
        assert(array2.bytes() === array.bytes());
        var buff3 = array2.hostSync();
        assert(buff3 instanceof Buffer);
        assert(buff3.length === int.size * count);
        for (var v$__8 = 0; v$__8 < count; v$__8++) {
          var v1$__9 = int.get(buff, v$__8 * int.size);
          var v2$__10 = int.get(buff3, v$__8 * int.size);
          assert(v1$__9 === v2$__10);
          assert(v1$__9 === v$__8 * v$__8);
        }
        var v = array2.valueSync();
        assert(v === 0.0);
        v = array.at(1).valueSync();
        assert(v === 1.0);
        v = array2.at(2).scalarSync();
        assert(v === 4.0);
        v = array2.at("end").scalarSync();
        assert(v === 9.0 * 9.0);
        v = array2.at(af.end - 1).scalarSync();
        assert(v === 8.0 * 8.0);
      });
      it("should be tests for assignment operators", function() {
        console.log(("TODO: implement array assignment operator tests for " + id + "\n"));
      });
      it("should be tests for indexing operators", function() {
        console.log(("TODO: implement array indexing operator tests for " + id + "\n"));
      });
      it("should be tests for row", function() {
        console.log(("TODO: implement array row test for " + id + "\n"));
      });
      it("should be tests for col", function() {
        console.log(("TODO: implement array col test for " + id + "\n"));
      });
      it("should be tests for slice", function() {
        console.log(("TODO: implement array slice test for " + id + "\n"));
      });
      it("should be tests for rows", function() {
        console.log(("TODO: implement array rows test for " + id + "\n"));
      });
      it("should be tests for cols", function() {
        console.log(("TODO: implement array cols test for " + id + "\n"));
      });
      it("should be tests for slices", function() {
        console.log(("TODO: implement array slices test for " + id + "\n"));
      });
      it("should be tests for as", function() {
        console.log(("TODO: implement array as test for " + id + "\n"));
      });
      it("should be tests for arithmetic operators", function() {
        console.log(("TODO: implement array arithmetic operator tests for " + id + "\n"));
      });
      it("should be tests for logical operators", function() {
        console.log(("TODO: implement array logical operator tests for " + id + "\n"));
      });
    });
  }
}
describe("AFArray class and methods", function() {
  testPlatform("CPU");
  testPlatform("OpenCL");
  testPlatform("CUDA");
});

//# sourceMappingURL=afArrayTests.js.map
