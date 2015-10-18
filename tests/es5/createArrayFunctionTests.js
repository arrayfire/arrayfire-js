"use strict";
var assert = require("better-assert");
var _ = require("lodash");
var ref = require("ref");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var int = ref.types.int;
var float = ref.types.float;
function testPlatform(id) {
  if (process.env["TEST_" + id] === "1") {
    describe(id + " platform", function() {
      var af = require("../..")(id);
      describe("randu", function() {
        it("should yield uniform random int array with 2 dimensions", function(done) {
          var f = async($traceurRuntime.initGeneratorFunction(function $__0() {
            var array,
                data,
                i,
                v;
            return $traceurRuntime.createGeneratorInstance(function($ctx) {
              while (true)
                switch ($ctx.state) {
                  case 0:
                    array = af.randu(2, 4, af.dType.s32);
                    $ctx.state = 6;
                    break;
                  case 6:
                    $ctx.state = 2;
                    return array.copyToHostAsync();
                  case 2:
                    data = $ctx.sent;
                    $ctx.state = 4;
                    break;
                  case 4:
                    assert(data instanceof Buffer);
                    assert(data.length == 2 * 4 * int.size);
                    for (i = 0; i < data.length / int.size; i++) {
                      v = int.get(data, i * int.size);
                      assert(v >= Number.MIN_SAFE_INTEGER && v <= Number.MAX_SAFE_INTEGER);
                      assert(Math.floor(v) === v);
                    }
                    $ctx.state = -2;
                    break;
                  default:
                    return $ctx.end();
                }
            }, $__0, this);
          }));
          f().nodeify(done);
        });
        it("should yield uniform random float array with 2 dimensions", function(done) {
          var f = async($traceurRuntime.initGeneratorFunction(function $__0() {
            var array,
                data,
                i,
                v;
            return $traceurRuntime.createGeneratorInstance(function($ctx) {
              while (true)
                switch ($ctx.state) {
                  case 0:
                    array = af.randu([2, 4], af.dType.f32);
                    $ctx.state = 6;
                    break;
                  case 6:
                    $ctx.state = 2;
                    return array.copyToHostAsync();
                  case 2:
                    data = $ctx.sent;
                    $ctx.state = 4;
                    break;
                  case 4:
                    assert(data instanceof Buffer);
                    assert(data.length == 2 * 4 * float.size);
                    for (i = 0; i < data.length / float.size; i++) {
                      v = float.get(data, i * float.size);
                      assert(v === 0 || v === 1.0 || (v > 0 && v < 1.0 && v % 1));
                    }
                    $ctx.state = -2;
                    break;
                  default:
                    return $ctx.end();
                }
            }, $__0, this);
          }));
          f().nodeify(done);
        });
      });
      describe("randf", function() {
        it("should throw error when invoking normal random int array with 2 dimensions", function() {
          try {
            var array = af.randn(2, 4, af.dType.s32);
            return;
          } catch (e) {
            if (/invalid dtype argument/ig.test(e.message)) {
              return;
            } else {
              throw new Error("This should throw appropriate error.");
            }
          }
          throw new Error("This should throw.");
        });
        it("should yield normal random float array with 2 dimensions", function(done) {
          var f = async($traceurRuntime.initGeneratorFunction(function $__0() {
            var array,
                data,
                i,
                v;
            return $traceurRuntime.createGeneratorInstance(function($ctx) {
              while (true)
                switch ($ctx.state) {
                  case 0:
                    array = af.randn([2, 4], af.dType.f32);
                    $ctx.state = 6;
                    break;
                  case 6:
                    $ctx.state = 2;
                    return array.copyToHostAsync();
                  case 2:
                    data = $ctx.sent;
                    $ctx.state = 4;
                    break;
                  case 4:
                    assert(data instanceof Buffer);
                    assert(data.length == 2 * 4 * float.size);
                    for (i = 0; i < data.length / float.size; i++) {
                      v = float.get(data, i * float.size);
                      assert(v === 0 || (v > -4.0 && v < 4.0 && v % 1));
                    }
                    $ctx.state = -2;
                    break;
                  default:
                    return $ctx.end();
                }
            }, $__0, this);
          }));
          f().nodeify(done);
        });
      });
      describe("identity", function() {
        it("should be implemented", function() {
          console.log(("TODO: implement identity test for " + id + "\n"));
        });
      });
      describe("range", function() {
        it("should be implemented", function() {
          console.log(("TODO: implement range test for " + id + "\n"));
        });
      });
      describe("iota", function() {
        it("should be implemented", function() {
          console.log(("TODO: implement iota test for " + id + "\n"));
        });
      });
      describe("diag", function() {
        it("should be implemented", function() {
          console.log(("TODO: implement diag test for " + id + "\n"));
        });
      });
      describe("constant", function() {
        it("should be implemented", function() {
          console.log(("TODO: implement constant test for " + id + "\n"));
        });
      });
    });
  }
}
describe("Functions to create arrays", function() {
  testPlatform("CPU");
  testPlatform("OpenCL");
  testPlatform("CUDA");
});

//# sourceMappingURL=createArrayFunctionTests.js.map
