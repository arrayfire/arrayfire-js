"use strict";
"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
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
          return f(fireOfToolkit, deviceInfo);
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
//# sourceMappingURL=data:application/json;base64,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USxFQUFJO0FBQ2Isa0JBQWdCLENBQUcsa0JBQWdCO0FBQ25DLGdCQUFjLENBQUcsZ0JBQWM7QUFBQSxBQUNuQyxDQUFDO0FBQ0QiLCJmaWxlIjoiY29tbW9uL2luZGV4LmpzIiwic291cmNlUm9vdCI6ImV4YW1wbGVzL2VzNiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xubGV0IEJsdWViaXJkID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xubGV0IGZpcmUgPSByZXF1aXJlKFwiLi4vLi4vLi5cIik7XG5sZXQgdXRpbCA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xubGV0IG5vdyA9IHJlcXVpcmUoXCJwZXJmb3JtYW5jZS1ub3dcIik7XG5cbmxldCBydW5PbkRldmljZXMgPSBhc3luYyhmdW5jdGlvbioocGxhdGZvcm1JRCwgZikge1xuICAgIGxldCBmaXJlT2ZUb29sa2l0ID0gZmlyZShwbGF0Zm9ybUlEKTtcbiAgICBmb3IgKGxldCBkZXZpY2VJbmZvIG9mIGZpcmVPZlRvb2xraXQuZ2V0RGV2aWNlcygpKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbm93KCk7XG4gICAgICAgIHlpZWxkIGYoZmlyZU9mVG9vbGtpdCwgZGV2aWNlSW5mbyk7XG4gICAgICAgIGNvbnN0IGVuZCA9IG5vdygpO1xuICAgICAgICBjb25zb2xlLmxvZyhgXFxuLS0gdG9vayAkeygoZW5kIC0gc3RhcnQpIC8gMTAwMCkudG9GaXhlZCgxMCl9IHNlY29uZHNcXG5gKTtcbiAgICB9XG59KTtcblxubGV0IHJ1bk9uQWxsUGxhdGZyb21zID0gYXN5bmMoZnVuY3Rpb24qKGYsIG5hbWUpIHtcbiAgICBsZXQgcGxhdGZyb21zID0gZmlyZS5zdXBwb3J0ZWRQbGF0Zm9ybXMoKTtcbiAgICBjb25zb2xlLmxvZyhgUnVubmluZyAke25hbWV9IG9uIGFsbCBzdXBwb3J0ZWQgcGxhdGZyb21zOiAke3BsYXRmcm9tcy5qb2luKFwiLCBcIil9XFxuYCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yIChsZXQgaWQgb2YgcGxhdGZyb21zKSB7XG4gICAgICAgICAgICB5aWVsZCBydW5PbkRldmljZXMoaWQsIGYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICB9XG59KTtcblxubGV0IHByaW50RGV2aWNlSW5mbyA9IGZ1bmN0aW9uKGRldmljZUluZm8pIHtcbiAgICBjb25zb2xlLmxvZyhgSUQ6ICR7ZGV2aWNlSW5mby5pZH1cXG5OYW1lOiAke2RldmljZUluZm8ubmFtZX1cXG5QbGF0Zm9ybTogJHtkZXZpY2VJbmZvLnBsYXRmb3JtfVxcblRvb2xraXQ6ICR7ZGV2aWNlSW5mby50b29sa2l0fVxcbkNvbXB1dGU6ICR7ZGV2aWNlSW5mby5jb21wdXRlfWApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcnVuT25BbGxQbGF0ZnJvbXM6IHJ1bk9uQWxsUGxhdGZyb21zLFxuICAgIHByaW50RGV2aWNlSW5mbzogcHJpbnREZXZpY2VJbmZvXG59O1xuIl19
