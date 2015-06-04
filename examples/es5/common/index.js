"use strict";
"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var asyncSupport = Bluebird.promisifyAll;
var fire = require("../../..");
var util = require("util");
var now = require("performance-now");
var runOnDevices = async($traceurRuntime.initGeneratorFunction(function $__7(platformID, f) {
  var fireOfToolkit,
      $__3,
      $__4,
      $__5,
      $__1,
      $__0,
      deviceInfo,
      start,
      end,
      $__6;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          fireOfToolkit = fire(platformID);
          $__3 = true;
          $__4 = false;
          $__5 = undefined;
          $ctx.state = 28;
          break;
        case 28:
          $ctx.pushTry(14, 15);
          $ctx.state = 17;
          break;
        case 17:
          $__1 = void 0, $__0 = (fireOfToolkit.getDevices())[$traceurRuntime.toProperty(Symbol.iterator)]();
          $ctx.state = 13;
          break;
        case 13:
          $ctx.state = (!($__3 = ($__1 = $__0.next()).done)) ? 9 : 11;
          break;
        case 8:
          $__3 = true;
          $ctx.state = 13;
          break;
        case 9:
          deviceInfo = $__1.value;
          $ctx.state = 10;
          break;
        case 10:
          start = now();
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return f(asyncSupport(fireOfToolkit), deviceInfo);
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 4:
          end = now();
          console.log(("\n-- took " + ((end - start) / 1000).toFixed(10) + " seconds\n"));
          $ctx.state = 8;
          break;
        case 11:
          $ctx.popTry();
          $ctx.state = 15;
          $ctx.finallyFallThrough = -2;
          break;
        case 14:
          $ctx.popTry();
          $ctx.maybeUncatchable();
          $__6 = $ctx.storedException;
          $ctx.state = 20;
          break;
        case 20:
          $__4 = true;
          $__5 = $__6;
          $ctx.state = 15;
          $ctx.finallyFallThrough = -2;
          break;
        case 15:
          $ctx.popTry();
          $ctx.state = 26;
          break;
        case 26:
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
          $ctx.state = 24;
          break;
        case 24:
          $ctx.state = $ctx.finallyFallThrough;
          break;
        default:
          return $ctx.end();
      }
  }, $__7, this);
}));
var runOnAllPlatfroms = async($traceurRuntime.initGeneratorFunction(function $__8(f, name) {
  var platfroms,
      $__3,
      $__4,
      $__5,
      $__1,
      $__0,
      id,
      $__6,
      e;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          platfroms = fire.supportedPlatforms();
          console.log(("Running " + name + " on all supported platfroms: " + platfroms.join(", ") + "\n"));
          $ctx.state = 35;
          break;
        case 35:
          $ctx.pushTry(25, null);
          $ctx.state = 28;
          break;
        case 28:
          $__3 = true;
          $__4 = false;
          $__5 = undefined;
          $ctx.state = 24;
          break;
        case 24:
          $ctx.pushTry(10, 11);
          $ctx.state = 13;
          break;
        case 13:
          $__1 = void 0, $__0 = (platfroms)[$traceurRuntime.toProperty(Symbol.iterator)]();
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!($__3 = ($__1 = $__0.next()).done)) ? 5 : 7;
          break;
        case 4:
          $__3 = true;
          $ctx.state = 9;
          break;
        case 5:
          id = $__1.value;
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return runOnDevices(id, f);
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 7:
          $ctx.popTry();
          $ctx.state = 11;
          $ctx.finallyFallThrough = 15;
          break;
        case 10:
          $ctx.popTry();
          $ctx.maybeUncatchable();
          $__6 = $ctx.storedException;
          $ctx.state = 16;
          break;
        case 16:
          $__4 = true;
          $__5 = $__6;
          $ctx.state = 11;
          $ctx.finallyFallThrough = 15;
          break;
        case 11:
          $ctx.popTry();
          $ctx.state = 22;
          break;
        case 22:
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
          $ctx.state = 20;
          break;
        case 15:
          $ctx.popTry();
          $ctx.state = -2;
          break;
        case 25:
          $ctx.popTry();
          $ctx.maybeUncatchable();
          e = $ctx.storedException;
          $ctx.state = 31;
          break;
        case 31:
          console.error(e.stack);
          $ctx.state = -2;
          break;
        case 20:
          $ctx.state = $ctx.finallyFallThrough;
          break;
        default:
          return $ctx.end();
      }
  }, $__8, this);
}));
var printDeviceInfo = function(deviceInfo) {
  console.log(("ID: " + deviceInfo.id + "\nName: " + deviceInfo.name + "\nPlatform: " + deviceInfo.platform + "\nToolkit: " + deviceInfo.toolkit + "\nCompute: " + deviceInfo.compute));
};
module.exports = {
  runOnAllPlatfroms: runOnAllPlatfroms,
  printDeviceInfo: printDeviceInfo
};
//# sourceMappingURL=data:application/json;base64,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QUFTLFFBQVEsRUFBQyxjQUFhLEVBQUMsQ0FBQSxVQUFTLFFBQVEsRUFBRyxDQUFDO0FBQ25LLENBQUM7QUFFRCxLQUFLLFFBQVEsRUFBSTtBQUNiLGtCQUFnQixDQUFHLGtCQUFnQjtBQUNuQyxnQkFBYyxDQUFHLGdCQUFjO0FBQUEsQUFDbkMsQ0FBQztBQUFBIiwiZmlsZSI6ImNvbW1vbi9pbmRleC5qcyIsInNvdXJjZVJvb3QiOiJleGFtcGxlcy9lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxubGV0IEJsdWViaXJkID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xyXG5sZXQgYXN5bmMgPSBCbHVlYmlyZC5jb3JvdXRpbmU7XHJcbmxldCBhc3luY1N1cHBvcnQgPSBCbHVlYmlyZC5wcm9taXNpZnlBbGw7XHJcbmxldCBmaXJlID0gcmVxdWlyZShcIi4uLy4uLy4uXCIpO1xyXG5sZXQgdXRpbCA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xyXG52YXIgbm93ID0gcmVxdWlyZShcInBlcmZvcm1hbmNlLW5vd1wiKTtcclxuXHJcbmxldCBydW5PbkRldmljZXMgPSBhc3luYyhmdW5jdGlvbioocGxhdGZvcm1JRCwgZikge1xyXG4gICAgbGV0IGZpcmVPZlRvb2xraXQgPSBmaXJlKHBsYXRmb3JtSUQpO1xyXG4gICAgZm9yIChsZXQgZGV2aWNlSW5mbyBvZiBmaXJlT2ZUb29sa2l0LmdldERldmljZXMoKSkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbm93KCk7XHJcbiAgICAgICAgeWllbGQgZihhc3luY1N1cHBvcnQoZmlyZU9mVG9vbGtpdCksIGRldmljZUluZm8pO1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5vdygpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG4tLSB0b29rICR7KChlbmQgLSBzdGFydCkgLyAxMDAwKS50b0ZpeGVkKDEwKX0gc2Vjb25kc1xcbmApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmxldCBydW5PbkFsbFBsYXRmcm9tcyA9IGFzeW5jKGZ1bmN0aW9uKihmLCBuYW1lKSB7XHJcbiAgICBsZXQgcGxhdGZyb21zID0gZmlyZS5zdXBwb3J0ZWRQbGF0Zm9ybXMoKTtcclxuICAgIGNvbnNvbGUubG9nKGBSdW5uaW5nICR7bmFtZX0gb24gYWxsIHN1cHBvcnRlZCBwbGF0ZnJvbXM6ICR7cGxhdGZyb21zLmpvaW4oXCIsIFwiKX1cXG5gKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZm9yIChsZXQgaWQgb2YgcGxhdGZyb21zKSB7XHJcbiAgICAgICAgICAgIHlpZWxkIHJ1bk9uRGV2aWNlcyhpZCwgZik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2goZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubGV0IHByaW50RGV2aWNlSW5mbyA9IGZ1bmN0aW9uKGRldmljZUluZm8pIHtcclxuICAgIGNvbnNvbGUubG9nKGBJRDogJHtkZXZpY2VJbmZvLmlkfVxcbk5hbWU6ICR7ZGV2aWNlSW5mby5uYW1lfVxcblBsYXRmb3JtOiAke2RldmljZUluZm8ucGxhdGZvcm19XFxuVG9vbGtpdDogJHtkZXZpY2VJbmZvLnRvb2xraXR9XFxuQ29tcHV0ZTogJHtkZXZpY2VJbmZvLmNvbXB1dGV9YCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHJ1bk9uQWxsUGxhdGZyb21zOiBydW5PbkFsbFBsYXRmcm9tcyxcclxuICAgIHByaW50RGV2aWNlSW5mbzogcHJpbnREZXZpY2VJbmZvXHJcbn07Il19
