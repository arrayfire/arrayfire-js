"use strict";
var assert = require("better-assert");
var _ = require("lodash");
var Bluebird = require("bluebird");
function testPlatform(id) {
  if (process.env["TEST_" + id] === "1") {
    describe(id + " platform", function() {
      var af = require("../..")(id);
      it("should return available devices", function() {
        var deviceCount = af.getDeviceCount();
        assert(deviceCount > 0);
        var infos = af.getDevices();
        assert(_.isArray(infos));
        assert(infos.length === deviceCount);
        var $__3 = true;
        var $__4 = false;
        var $__5 = undefined;
        try {
          for (var $__1 = void 0,
              $__0 = (infos)[Symbol.iterator](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
            var info = $__1.value;
            {
              assert(_.isString(info.name) && info.name);
              assert(_.isString(info.platform) && info.platform);
              assert(_.isString(info.compute) && info.compute);
              assert(_.isBoolean(info.isDoubleAvailable));
            }
          }
        } catch ($__6) {
          $__4 = true;
          $__5 = $__6;
        } finally {
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
        }
      });
      it("should do sync with callback", function(done) {
        af.sync(done);
      });
      it("should do sync with promise", function(done) {
        af.syncAsync().nodeify(done);
      });
      it("sync should failed if device is out of range", function(done) {
        af.syncAsync(100).then(function() {
          done(new Error("This should fail!"));
        }, function() {
          done();
        });
      });
    });
  }
}
describe("device methods", function() {
  testPlatform("CPU");
  testPlatform("OpenCL");
  testPlatform("CUDA");
});

//# sourceMappingURL=deviceTests.js.map
