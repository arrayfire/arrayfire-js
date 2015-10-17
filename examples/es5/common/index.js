"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var af = require("../../..");
var util = require("util");
var now = require("performance-now");
var _ = require("lodash");
var runOnDevices = async($traceurRuntime.initGeneratorFunction(function $__8(platformID, f, onID) {
  var afOfPlatform,
      $__4,
      $__5,
      $__6,
      $__2,
      $__1,
      deviceInfo,
      start,
      end,
      $__7;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          afOfPlatform = af(platformID);
          $__4 = true;
          $__5 = false;
          $__6 = undefined;
          $ctx.state = 29;
          break;
        case 29:
          $ctx.pushTry(15, 16);
          $ctx.state = 18;
          break;
        case 18:
          $__2 = void 0, $__1 = (afOfPlatform.getDevices())[Symbol.iterator]();
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = (!($__4 = ($__2 = $__1.next()).done)) ? 10 : 12;
          break;
        case 8:
          $__4 = true;
          $ctx.state = 14;
          break;
        case 10:
          deviceInfo = $__2.value;
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = (_.isUndefined(onID) || onID === deviceInfo.id) ? 5 : 8;
          break;
        case 5:
          afOfPlatform.setDevice(deviceInfo.id);
          start = now();
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return f(afOfPlatform, deviceInfo);
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 4:
          end = now();
          console.log(("\n-- took " + ((end - start) / 1000).toFixed(10) + " seconds\n"));
          $ctx.state = 8;
          break;
        case 12:
          $ctx.popTry();
          $ctx.state = 16;
          $ctx.finallyFallThrough = -2;
          break;
        case 15:
          $ctx.popTry();
          $ctx.maybeUncatchable();
          $__7 = $ctx.storedException;
          $ctx.state = 21;
          break;
        case 21:
          $__5 = true;
          $__6 = $__7;
          $ctx.state = 16;
          $ctx.finallyFallThrough = -2;
          break;
        case 16:
          $ctx.popTry();
          $ctx.state = 27;
          break;
        case 27:
          try {
            if (!$__4 && $__1.return != null) {
              $__1.return();
            }
          } finally {
            if ($__5) {
              throw $__6;
            }
          }
          $ctx.state = 25;
          break;
        case 25:
          $ctx.state = $ctx.finallyFallThrough;
          break;
        default:
          return $ctx.end();
      }
  }, $__8, this);
}));
var runOnAllPlatforms = async($traceurRuntime.initGeneratorFunction(function $__9(f, name) {
  var platfroms,
      $__4,
      $__5,
      $__6,
      $__2,
      $__1,
      id,
      $__7,
      e;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          platfroms = af.supportedPlatforms();
          console.log(("Running " + name + " on all supported platfroms: " + platfroms.join(", ") + "\n"));
          $ctx.state = 35;
          break;
        case 35:
          $ctx.pushTry(25, null);
          $ctx.state = 28;
          break;
        case 28:
          $__4 = true;
          $__5 = false;
          $__6 = undefined;
          $ctx.state = 24;
          break;
        case 24:
          $ctx.pushTry(10, 11);
          $ctx.state = 13;
          break;
        case 13:
          $__2 = void 0, $__1 = (platfroms)[Symbol.iterator]();
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = (!($__4 = ($__2 = $__1.next()).done)) ? 5 : 7;
          break;
        case 4:
          $__4 = true;
          $ctx.state = 9;
          break;
        case 5:
          id = $__2.value;
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
          $__7 = $ctx.storedException;
          $ctx.state = 16;
          break;
        case 16:
          $__5 = true;
          $__6 = $__7;
          $ctx.state = 11;
          $ctx.finallyFallThrough = 15;
          break;
        case 11:
          $ctx.popTry();
          $ctx.state = 22;
          break;
        case 22:
          try {
            if (!$__4 && $__1.return != null) {
              $__1.return();
            }
          } finally {
            if ($__5) {
              throw $__6;
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
  }, $__9, this);
}));
var runOnBestDevice = async($traceurRuntime.initGeneratorFunction(function $__10(f, name) {
  var platfroms,
      order,
      e;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          platfroms = af.supportedPlatforms();
          order = ["CUDA", "OpenCL", "CPU"];
          console.log(("Running " + name + " on best available device.\n"));
          $ctx.state = 25;
          break;
        case 25:
          $ctx.pushTry(15, null);
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = (_(platfroms).contains(order[0])) ? 1 : 13;
          break;
        case 1:
          $ctx.state = 2;
          return runOnDevices(order[0], f, 0);
        case 2:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 13:
          $ctx.state = (_(platfroms).contains(order[1])) ? 5 : 9;
          break;
        case 5:
          $ctx.state = 6;
          return runOnDevices(order[1], f, 0);
        case 6:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 9:
          $ctx.state = 10;
          return runOnDevices(order[2], f, 0);
        case 10:
          $ctx.maybeThrow();
          $ctx.state = 4;
          break;
        case 4:
          $ctx.popTry();
          $ctx.state = -2;
          break;
        case 15:
          $ctx.popTry();
          $ctx.maybeUncatchable();
          e = $ctx.storedException;
          $ctx.state = 21;
          break;
        case 21:
          console.error(e.stack);
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__10, this);
}));
var printDeviceInfo = function(deviceInfo) {
  console.log(("ID: " + deviceInfo.id + "\nName: " + deviceInfo.name + "\nPlatform: " + deviceInfo.platform + "\nToolkit: " + deviceInfo.toolkit + "\nCompute: " + deviceInfo.compute));
};
module.exports = {
  runOnAllPlatforms: runOnAllPlatforms,
  runOnBestDevice: runOnBestDevice,
  printDeviceInfo: printDeviceInfo
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQStCQTtBQUNBLEFBQUksRUFBQSxDQUFBLFFBQU8sRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLFVBQVMsQ0FBQyxDQUFDO0FBQ2xDLEFBQUksRUFBQSxDQUFBLEtBQUksRUFBSSxDQUFBLFFBQU8sVUFBVSxDQUFDO0FBQzlCLEFBQUksRUFBQSxDQUFBLEVBQUMsRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLFVBQVMsQ0FBQyxDQUFDO0FBQzVCLEFBQUksRUFBQSxDQUFBLElBQUcsRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLE1BQUssQ0FBQyxDQUFDO0FBQzFCLEFBQUksRUFBQSxDQUFBLEdBQUUsRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLGlCQUFnQixDQUFDLENBQUM7QUFDcEMsQUFBSSxFQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUM7QUFFekIsQUFBSSxFQUFBLENBQUEsWUFBVyxFQUFJLENBQUEsS0FBSSxBQUFDLENBdkN4QixlQUFjLHNCQUFzQixBQUFDLENBdUNaLGNBQVUsVUFBUyxDQUFHLENBQUEsQ0FBQSxDQUFHLENBQUEsSUFBRzs7Ozs7Ozs7Ozs7QUF2Q3JELE9BQU8sQ0FBUCxlQUFjLHdCQUF3QixBQUFkLENBQXhCLFNBQVMsSUFBRyxDQUFHO0FBQ1QsVUFBTyxJQUFHOzs7dUJBdUNPLENBQUEsRUFBQyxBQUFDLENBQUMsVUFBUyxDQUFDO2VBdkNKLEtBQUc7ZUFDSCxNQUFJO2VBQ0osVUFBUTs7OztBQUh4QyxhQUFHLFFBQVEsQUFBQyxRQUVpQixDQUFDOzs7O2VBRjlCLEtBQUssRUFBQSxRQUVnQyxDQUFBLENBdUNWLFlBQVcsV0FBVyxBQUFDLEVBQUMsQ0F2Q0ksQ0FBRSxNQUFLLFNBQVMsQ0FBQyxBQUFDLEVBQUM7Ozs7QUFGMUUsYUFBRyxNQUFNLEVBQUksQ0FBQSxDQUdBLENBQUMsQ0FBQyxNQUFvQixDQUFBLENBQUMsTUFBb0IsQ0FBQSxTQUFxQixBQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FIdkQsVUFBd0MsQ0FBQztBQUNoRSxlQUFJOztBQUdDLGVBQW9CLEtBQUc7Ozs7Ozs7O0FBSnBDLGFBQUcsTUFBTSxFQUFJLENBQUEsQ0EwQ0QsQ0FBQSxZQUFZLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQSxFQUFLLENBQUEsSUFBRyxJQUFNLENBQUEsVUFBUyxHQUFHLENBMUN6QixRQUF3QyxDQUFDO0FBQ2hFLGVBQUk7O0FBMENBLHFCQUFXLFVBQVUsQUFBQyxDQUFDLFVBQVMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUEsR0FBRSxBQUFDLEVBQUM7Ozs7O2VBQ1osQ0FBQSxDQUFBLEFBQUMsQ0FBQyxZQUFXLENBQUcsV0FBUyxDQUFDOztBQTdDNUMsYUFBRyxXQUFXLEFBQUMsRUFBQyxDQUFBOzs7O2NBOENRLENBQUEsR0FBRSxBQUFDLEVBQUM7QUFDaEIsZ0JBQU0sSUFBSSxBQUFDLEVBQUMsWUFBWSxFQUFDLENBQUEsQ0FBQyxDQUFDLEdBQUUsRUFBSSxNQUFJLENBQUMsRUFBSSxLQUFHLENBQUMsUUFBUSxBQUFDLENBQUMsRUFBQyxDQUFDLENBQUEsQ0FBQyxhQUFXLEVBQUMsQ0FBQzs7OztBQS9DcEYsYUFBRyxPQUFPLEFBQUMsRUFBQyxDQUFDOztBQUFiLGFBQUcsbUJBQW1CLEtBQW9CLENBQUE7OztBQUM1QixhQUFHLE9BQU8sQUFBQyxFQUFDLENBQUM7QUFDYixhQUFHLGlCQUFpQixBQUFDLEVBQUMsQ0FBQztBQUN2QixlQUFvQixDQUFBLElBQUcsZ0JBQWdCLENBQUM7Ozs7QUFJNUMsZUFBb0IsS0FBRyxDQUFDO0FBQ3hCLG9CQUFvQyxDQUFDOztBQVIvQyxhQUFHLG1CQUFtQixLQUFvQixDQUFBOzs7QUFBMUMsYUFBRyxPQUFPLEFBQUMsRUFBQyxDQUFDOzs7O0FBVUgsWUFBSTtBQUNGLGVBQUksS0FBaUIsR0FBSyxDQUFBLFdBQXVCLEdBQUssS0FBRyxDQUFHO0FBQzFELHdCQUF3QixBQUFDLEVBQUMsQ0FBQztZQUM3QjtBQUFBLFVBQ0YsQ0FBRSxPQUFRO0FBQ1Isb0JBQXdCO0FBQ3RCLHdCQUF3QjtZQUMxQjtBQUFBLFVBQ0Y7QUFBQTs7O0FBakJZLGFBQUcsTUFBTSxFQUFJLENBQUEsSUFBRyxtQkFBbUIsQ0FBQztBQUNwQyxlQUFLOztBQUYzQixlQUFPLENBQUEsSUFBRyxJQUFJLEFBQUMsRUFBQyxDQUFBOztBQUNtQixFQUMvQixPQUE2QixLQUFHLENBQUMsQ0FBQztBQWdEdEMsQ0FsRHVELENBa0R0RCxDQUFDO0FBRUYsQUFBSSxFQUFBLENBQUEsaUJBQWdCLEVBQUksQ0FBQSxLQUFJLEFBQUMsQ0FwRDdCLGVBQWMsc0JBQXNCLEFBQUMsQ0FvRFAsY0FBVSxDQUFBLENBQUcsQ0FBQSxJQUFHOzs7Ozs7Ozs7O0FBcEQ5QyxPQUFPLENBQVAsZUFBYyx3QkFBd0IsQUFBZCxDQUF4QixTQUFTLElBQUcsQ0FBRztBQUNULFVBQU8sSUFBRzs7O29CQW9ESSxDQUFBLEVBQUMsbUJBQW1CLEFBQUMsRUFBQztBQUN0QyxnQkFBTSxJQUFJLEFBQUMsRUFBQyxVQUFVLEVBQUMsS0FBRyxFQUFDLGdDQUErQixFQUFDLENBQUEsU0FBUSxLQUFLLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQSxDQUFDLEtBQUcsRUFBQyxDQUFDOzs7O0FBdER4RixhQUFHLFFBQVEsQUFBQyxVQUVpQixDQUFDOzs7O2VBREUsS0FBRztlQUNILE1BQUk7ZUFDSixVQUFROzs7O0FBSHhDLGFBQUcsUUFBUSxBQUFDLFFBRWlCLENBQUM7Ozs7ZUFGOUIsS0FBSyxFQUFBLFFBRWdDLENBQUEsQ0FzRGQsU0FBUSxDQXREd0IsQ0FBRSxNQUFLLFNBQVMsQ0FBQyxBQUFDLEVBQUM7Ozs7QUFGMUUsYUFBRyxNQUFNLEVBQUksQ0FBQSxDQUdBLENBQUMsQ0FBQyxNQUFvQixDQUFBLENBQUMsTUFBb0IsQ0FBQSxTQUFxQixBQUFDLEVBQUMsQ0FBQyxLQUFLLENBQUMsQ0FIdkQsUUFBd0MsQ0FBQztBQUNoRSxlQUFJOztBQUdDLGVBQW9CLEtBQUc7Ozs7Ozs7OztlQXFEbEIsQ0FBQSxZQUFXLEFBQUMsQ0FBQyxFQUFDLENBQUcsRUFBQSxDQUFDOztBQXpEcEMsYUFBRyxXQUFXLEFBQUMsRUFBQyxDQUFBOzs7O0FBQWhCLGFBQUcsT0FBTyxBQUFDLEVBQUMsQ0FBQzs7QUFBYixhQUFHLG1CQUFtQixLQUFvQixDQUFBOzs7QUFDNUIsYUFBRyxPQUFPLEFBQUMsRUFBQyxDQUFDO0FBQ2IsYUFBRyxpQkFBaUIsQUFBQyxFQUFDLENBQUM7QUFDdkIsZUFBb0IsQ0FBQSxJQUFHLGdCQUFnQixDQUFDOzs7O0FBSTVDLGVBQW9CLEtBQUcsQ0FBQztBQUN4QixvQkFBb0MsQ0FBQzs7QUFSL0MsYUFBRyxtQkFBbUIsS0FBb0IsQ0FBQTs7O0FBQTFDLGFBQUcsT0FBTyxBQUFDLEVBQUMsQ0FBQzs7OztBQVVILFlBQUk7QUFDRixlQUFJLEtBQWlCLEdBQUssQ0FBQSxXQUF1QixHQUFLLEtBQUcsQ0FBRztBQUMxRCx3QkFBd0IsQUFBQyxFQUFDLENBQUM7WUFDN0I7QUFBQSxVQUNGLENBQUUsT0FBUTtBQUNSLG9CQUF3QjtBQUN0Qix3QkFBd0I7WUFDMUI7QUFBQSxVQUNGO0FBQUE7OztBQWxCVixhQUFHLE9BQU8sQUFBQyxFQUFDLENBQUM7Ozs7QUFDQyxhQUFHLE9BQU8sQUFBQyxFQUFDLENBQUM7QUFDYixhQUFHLGlCQUFpQixBQUFDLEVBQUMsQ0FBQztBQUN2QixZQUFvQixDQUFBLElBQUcsZ0JBQWdCLENBQUM7Ozs7QUEwRDlDLGdCQUFNLE1BQU0sQUFBQyxDQUFDLENBQUEsTUFBTSxDQUFDLENBQUM7Ozs7QUE1RFIsYUFBRyxNQUFNLEVBQUksQ0FBQSxJQUFHLG1CQUFtQixDQUFDO0FBQ3BDLGVBQUs7O0FBRjNCLGVBQU8sQ0FBQSxJQUFHLElBQUksQUFBQyxFQUFDLENBQUE7O0FBQ21CLEVBQy9CLE9BQTZCLEtBQUcsQ0FBQyxDQUFDO0FBNkR0QyxDQS9EdUQsQ0ErRHRELENBQUM7QUFFRixBQUFJLEVBQUEsQ0FBQSxlQUFjLEVBQUksQ0FBQSxLQUFJLEFBQUMsQ0FqRTNCLGVBQWMsc0JBQXNCLEFBQUMsQ0FpRVQsZUFBVSxDQUFBLENBQUcsQ0FBQSxJQUFHOzs7O0FBakU1QyxPQUFPLENBQVAsZUFBYyx3QkFBd0IsQUFBZCxDQUF4QixTQUFTLElBQUcsQ0FBRztBQUNULFVBQU8sSUFBRzs7O29CQWlFSSxDQUFBLEVBQUMsbUJBQW1CLEFBQUMsRUFBQztnQkFDMUIsRUFBQyxNQUFLLENBQUcsU0FBTyxDQUFHLE1BQUksQ0FBQztBQUNwQyxnQkFBTSxJQUFJLEFBQUMsRUFBQyxVQUFVLEVBQUMsS0FBRyxFQUFDLCtCQUE2QixFQUFDLENBQUM7Ozs7QUFwRTlELGFBQUcsUUFBUSxBQUFDLFVBRWlCLENBQUM7Ozs7QUFGOUIsYUFBRyxNQUFNLEVBQUksQ0FBQSxDQXNFRCxDQUFBLEFBQUMsQ0FBQyxTQUFRLENBQUMsU0FBUyxBQUFDLENBQUMsS0FBSSxDQUFFLENBQUEsQ0FBQyxDQUFDLENBdEVYLFNBQXdDLENBQUM7QUFDaEUsZUFBSTs7O2VBc0VNLENBQUEsWUFBVyxBQUFDLENBQUMsS0FBSSxDQUFFLENBQUEsQ0FBQyxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUM7O0FBdkU3QyxhQUFHLFdBQVcsQUFBQyxFQUFDLENBQUE7Ozs7QUFBaEIsYUFBRyxNQUFNLEVBQUksQ0FBQSxDQXlFSSxDQUFBLEFBQUMsQ0FBQyxTQUFRLENBQUMsU0FBUyxBQUFDLENBQUMsS0FBSSxDQUFFLENBQUEsQ0FBQyxDQUFDLENBekVoQixRQUF3QyxDQUFDO0FBQ2hFLGVBQUk7OztlQXlFTSxDQUFBLFlBQVcsQUFBQyxDQUFDLEtBQUksQ0FBRSxDQUFBLENBQUMsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDOztBQTFFN0MsYUFBRyxXQUFXLEFBQUMsRUFBQyxDQUFBOzs7OztlQTZFRSxDQUFBLFlBQVcsQUFBQyxDQUFDLEtBQUksQ0FBRSxDQUFBLENBQUMsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFDOztBQTdFN0MsYUFBRyxXQUFXLEFBQUMsRUFBQyxDQUFBOzs7O0FBQWhCLGFBQUcsT0FBTyxBQUFDLEVBQUMsQ0FBQzs7OztBQUNDLGFBQUcsT0FBTyxBQUFDLEVBQUMsQ0FBQztBQUNiLGFBQUcsaUJBQWlCLEFBQUMsRUFBQyxDQUFDO0FBQ3ZCLFlBQW9CLENBQUEsSUFBRyxnQkFBZ0IsQ0FBQzs7OztBQThFOUMsZ0JBQU0sTUFBTSxBQUFDLENBQUMsQ0FBQSxNQUFNLENBQUMsQ0FBQzs7OztBQWpGOUIsZUFBTyxDQUFBLElBQUcsSUFBSSxBQUFDLEVBQUMsQ0FBQTs7QUFDbUIsRUFDL0IsUUFBNkIsS0FBRyxDQUFDLENBQUM7QUFpRnRDLENBbkZ1RCxDQW1GdEQsQ0FBQztBQUVGLEFBQUksRUFBQSxDQUFBLGVBQWMsRUFBSSxVQUFVLFVBQVMsQ0FBRztBQUN4QyxRQUFNLElBQUksQUFBQyxFQUFDLE1BQU0sRUFBQyxDQUFBLFVBQVMsR0FBRyxFQUFDLFdBQVUsRUFBQyxDQUFBLFVBQVMsS0FBSyxFQUFDLGVBQWMsRUFBQyxDQUFBLFVBQVMsU0FBUyxFQUFDLGNBQWEsRUFBQyxDQUFBLFVBQVMsUUFBUSxFQUFDLGNBQWEsRUFBQyxDQUFBLFVBQVMsUUFBUSxFQUFHLENBQUM7QUFDbkssQ0FBQztBQUVELEtBQUssUUFBUSxFQUFJO0FBQ2Isa0JBQWdCLENBQUcsa0JBQWdCO0FBQ25DLGdCQUFjLENBQUcsZ0JBQWM7QUFDL0IsZ0JBQWMsQ0FBRyxnQkFBYztBQUFBLEFBQ25DLENBQUM7QUFDRCIsImZpbGUiOiJjb21tb24vaW5kZXguanMiLCJzb3VyY2VSb290IjoiZXhhbXBsZXMvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiLypcbkNvcHlyaWdodCAoYykgMjAxNC0yMDE1LCBBcnJheUZpcmVcbkNvcHlyaWdodCAoYykgMjAxNSBHw6Fib3IgTWV6xZEgYWthIHVuYm9ybmNoaWtrZW4gKGdhYm9yLm1lem9Ab3V0bG9vay5jb20pXG5BbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpc1xuICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3JcbiAgb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgQXJyYXlGaXJlIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbldBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiovXG5cblwidXNlIHN0cmljdFwiO1xubGV0IEJsdWViaXJkID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xubGV0IGFmID0gcmVxdWlyZShcIi4uLy4uLy4uXCIpO1xubGV0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcbmxldCBub3cgPSByZXF1aXJlKFwicGVyZm9ybWFuY2Utbm93XCIpO1xubGV0IF8gPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5sZXQgcnVuT25EZXZpY2VzID0gYXN5bmMoZnVuY3Rpb24qKHBsYXRmb3JtSUQsIGYsIG9uSUQpIHtcbiAgICBsZXQgYWZPZlBsYXRmb3JtID0gYWYocGxhdGZvcm1JRCk7XG4gICAgZm9yIChsZXQgZGV2aWNlSW5mbyBvZiBhZk9mUGxhdGZvcm0uZ2V0RGV2aWNlcygpKSB7XG4gICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKG9uSUQpIHx8IG9uSUQgPT09IGRldmljZUluZm8uaWQpIHtcbiAgICAgICAgICAgIGFmT2ZQbGF0Zm9ybS5zZXREZXZpY2UoZGV2aWNlSW5mby5pZCk7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IG5vdygpO1xuICAgICAgICAgICAgeWllbGQgZihhZk9mUGxhdGZvcm0sIGRldmljZUluZm8pO1xuICAgICAgICAgICAgY29uc3QgZW5kID0gbm93KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgXFxuLS0gdG9vayAkeygoZW5kIC0gc3RhcnQpIC8gMTAwMCkudG9GaXhlZCgxMCl9IHNlY29uZHNcXG5gKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5sZXQgcnVuT25BbGxQbGF0Zm9ybXMgPSBhc3luYyhmdW5jdGlvbiooZiwgbmFtZSkge1xuICAgIGxldCBwbGF0ZnJvbXMgPSBhZi5zdXBwb3J0ZWRQbGF0Zm9ybXMoKTtcbiAgICBjb25zb2xlLmxvZyhgUnVubmluZyAke25hbWV9IG9uIGFsbCBzdXBwb3J0ZWQgcGxhdGZyb21zOiAke3BsYXRmcm9tcy5qb2luKFwiLCBcIil9XFxuYCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yIChsZXQgaWQgb2YgcGxhdGZyb21zKSB7XG4gICAgICAgICAgICB5aWVsZCBydW5PbkRldmljZXMoaWQsIGYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgfVxufSk7XG5cbmxldCBydW5PbkJlc3REZXZpY2UgPSBhc3luYyhmdW5jdGlvbiooZiwgbmFtZSkge1xuICAgIGxldCBwbGF0ZnJvbXMgPSBhZi5zdXBwb3J0ZWRQbGF0Zm9ybXMoKTtcbiAgICBsZXQgb3JkZXIgPSBbXCJDVURBXCIsIFwiT3BlbkNMXCIsIFwiQ1BVXCJdO1xuICAgIGNvbnNvbGUubG9nKGBSdW5uaW5nICR7bmFtZX0gb24gYmVzdCBhdmFpbGFibGUgZGV2aWNlLlxcbmApO1xuICAgIHRyeSB7XG4gICAgICAgIGlmIChfKHBsYXRmcm9tcykuY29udGFpbnMob3JkZXJbMF0pKSB7XG4gICAgICAgICAgICB5aWVsZCBydW5PbkRldmljZXMob3JkZXJbMF0sIGYsIDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF8ocGxhdGZyb21zKS5jb250YWlucyhvcmRlclsxXSkpIHtcbiAgICAgICAgICAgIHlpZWxkIHJ1bk9uRGV2aWNlcyhvcmRlclsxXSwgZiwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5aWVsZCBydW5PbkRldmljZXMob3JkZXJbMl0sIGYsIDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgfVxufSk7XG5cbmxldCBwcmludERldmljZUluZm8gPSBmdW5jdGlvbiAoZGV2aWNlSW5mbykge1xuICAgIGNvbnNvbGUubG9nKGBJRDogJHtkZXZpY2VJbmZvLmlkfVxcbk5hbWU6ICR7ZGV2aWNlSW5mby5uYW1lfVxcblBsYXRmb3JtOiAke2RldmljZUluZm8ucGxhdGZvcm19XFxuVG9vbGtpdDogJHtkZXZpY2VJbmZvLnRvb2xraXR9XFxuQ29tcHV0ZTogJHtkZXZpY2VJbmZvLmNvbXB1dGV9YCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBydW5PbkFsbFBsYXRmb3JtczogcnVuT25BbGxQbGF0Zm9ybXMsXG4gICAgcnVuT25CZXN0RGV2aWNlOiBydW5PbkJlc3REZXZpY2UsXG4gICAgcHJpbnREZXZpY2VJbmZvOiBwcmludERldmljZUluZm9cbn07XG4iXX0=
