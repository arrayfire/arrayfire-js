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

//# sourceMappingURL=index.js.map
