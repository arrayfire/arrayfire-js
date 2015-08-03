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
          $__2 = void 0, $__1 = (afOfPlatform.getDevices())[$traceurRuntime.toProperty(Symbol.iterator)]();
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
          $__2 = void 0, $__1 = (platfroms)[$traceurRuntime.toProperty(Symbol.iterator)]();
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
//# sourceMappingURL=data:application/json;base64,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Q0FBQzs7QUE3RTdDLGFBQUcsV0FBVyxBQUFDLEVBQUMsQ0FBQTs7OztBQUFoQixhQUFHLE9BQU8sQUFBQyxFQUFDLENBQUM7Ozs7QUFDQyxhQUFHLE9BQU8sQUFBQyxFQUFDLENBQUM7QUFDYixhQUFHLGlCQUFpQixBQUFDLEVBQUMsQ0FBQztBQUN2QixZQUFvQixDQUFBLElBQUcsZ0JBQWdCLENBQUM7Ozs7QUE4RTlDLGdCQUFNLE1BQU0sQUFBQyxDQUFDLENBQUEsTUFBTSxDQUFDLENBQUM7Ozs7QUFqRjlCLGVBQU8sQ0FBQSxJQUFHLElBQUksQUFBQyxFQUFDLENBQUE7O0FBQ21CLEVBQy9CLFFBQTZCLEtBQUcsQ0FBQyxDQUFDO0FBaUZ0QyxDQW5GdUQsQ0FtRnRELENBQUM7QUFFRixBQUFJLEVBQUEsQ0FBQSxlQUFjLEVBQUksVUFBVSxVQUFTLENBQUc7QUFDeEMsUUFBTSxJQUFJLEFBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQSxVQUFTLEdBQUcsRUFBQyxXQUFVLEVBQUMsQ0FBQSxVQUFTLEtBQUssRUFBQyxlQUFjLEVBQUMsQ0FBQSxVQUFTLFNBQVMsRUFBQyxjQUFhLEVBQUMsQ0FBQSxVQUFTLFFBQVEsRUFBQyxjQUFhLEVBQUMsQ0FBQSxVQUFTLFFBQVEsRUFBRyxDQUFDO0FBQ25LLENBQUM7QUFFRCxLQUFLLFFBQVEsRUFBSTtBQUNiLGtCQUFnQixDQUFHLGtCQUFnQjtBQUNuQyxnQkFBYyxDQUFHLGdCQUFjO0FBQy9CLGdCQUFjLENBQUcsZ0JBQWM7QUFBQSxBQUNuQyxDQUFDO0FBQ0QiLCJmaWxlIjoiY29tbW9uL2luZGV4LmpzIiwic291cmNlUm9vdCI6ImV4YW1wbGVzL2VzNiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgQXJyYXlGaXJlXG5Db3B5cmlnaHQgKGMpIDIwMTUgR8OhYm9yIE1lesWRIGFrYSB1bmJvcm5jaGlra2VuIChnYWJvci5tZXpvQG91dGxvb2suY29tKVxuQWxsIHJpZ2h0cyByZXNlcnZlZC5cblxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbixcbmFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcblxuICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzXG4gIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuXG4gKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yXG4gIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG5cbiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIEFycmF5RmlyZSBub3IgdGhlIG5hbWVzIG9mIGl0c1xuICBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbVxuICB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuXG5USElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkRcbkFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEXG5XQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFXG5ESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIEhPTERFUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUlxuQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4oSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG5MT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT05cbkFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4oSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4qL1xuXG5cInVzZSBzdHJpY3RcIjtcbmxldCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbmxldCBhc3luYyA9IEJsdWViaXJkLmNvcm91dGluZTtcbmxldCBhZiA9IHJlcXVpcmUoXCIuLi8uLi8uLlwiKTtcbmxldCB1dGlsID0gcmVxdWlyZShcInV0aWxcIik7XG5sZXQgbm93ID0gcmVxdWlyZShcInBlcmZvcm1hbmNlLW5vd1wiKTtcbmxldCBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxubGV0IHJ1bk9uRGV2aWNlcyA9IGFzeW5jKGZ1bmN0aW9uKihwbGF0Zm9ybUlELCBmLCBvbklEKSB7XG4gICAgbGV0IGFmT2ZQbGF0Zm9ybSA9IGFmKHBsYXRmb3JtSUQpO1xuICAgIGZvciAobGV0IGRldmljZUluZm8gb2YgYWZPZlBsYXRmb3JtLmdldERldmljZXMoKSkge1xuICAgICAgICBpZiAoXy5pc1VuZGVmaW5lZChvbklEKSB8fCBvbklEID09PSBkZXZpY2VJbmZvLmlkKSB7XG4gICAgICAgICAgICBhZk9mUGxhdGZvcm0uc2V0RGV2aWNlKGRldmljZUluZm8uaWQpO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBub3coKTtcbiAgICAgICAgICAgIHlpZWxkIGYoYWZPZlBsYXRmb3JtLCBkZXZpY2VJbmZvKTtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IG5vdygpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFxcbi0tIHRvb2sgJHsoKGVuZCAtIHN0YXJ0KSAvIDEwMDApLnRvRml4ZWQoMTApfSBzZWNvbmRzXFxuYCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxubGV0IHJ1bk9uQWxsUGxhdGZvcm1zID0gYXN5bmMoZnVuY3Rpb24qKGYsIG5hbWUpIHtcbiAgICBsZXQgcGxhdGZyb21zID0gYWYuc3VwcG9ydGVkUGxhdGZvcm1zKCk7XG4gICAgY29uc29sZS5sb2coYFJ1bm5pbmcgJHtuYW1lfSBvbiBhbGwgc3VwcG9ydGVkIHBsYXRmcm9tczogJHtwbGF0ZnJvbXMuam9pbihcIiwgXCIpfVxcbmApO1xuICAgIHRyeSB7XG4gICAgICAgIGZvciAobGV0IGlkIG9mIHBsYXRmcm9tcykge1xuICAgICAgICAgICAgeWllbGQgcnVuT25EZXZpY2VzKGlkLCBmKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIH1cbn0pO1xuXG5sZXQgcnVuT25CZXN0RGV2aWNlID0gYXN5bmMoZnVuY3Rpb24qKGYsIG5hbWUpIHtcbiAgICBsZXQgcGxhdGZyb21zID0gYWYuc3VwcG9ydGVkUGxhdGZvcm1zKCk7XG4gICAgbGV0IG9yZGVyID0gW1wiQ1VEQVwiLCBcIk9wZW5DTFwiLCBcIkNQVVwiXTtcbiAgICBjb25zb2xlLmxvZyhgUnVubmluZyAke25hbWV9IG9uIGJlc3QgYXZhaWxhYmxlIGRldmljZS5cXG5gKTtcbiAgICB0cnkge1xuICAgICAgICBpZiAoXyhwbGF0ZnJvbXMpLmNvbnRhaW5zKG9yZGVyWzBdKSkge1xuICAgICAgICAgICAgeWllbGQgcnVuT25EZXZpY2VzKG9yZGVyWzBdLCBmLCAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfKHBsYXRmcm9tcykuY29udGFpbnMob3JkZXJbMV0pKSB7XG4gICAgICAgICAgICB5aWVsZCBydW5PbkRldmljZXMob3JkZXJbMV0sIGYsIDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeWllbGQgcnVuT25EZXZpY2VzKG9yZGVyWzJdLCBmLCAwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIH1cbn0pO1xuXG5sZXQgcHJpbnREZXZpY2VJbmZvID0gZnVuY3Rpb24gKGRldmljZUluZm8pIHtcbiAgICBjb25zb2xlLmxvZyhgSUQ6ICR7ZGV2aWNlSW5mby5pZH1cXG5OYW1lOiAke2RldmljZUluZm8ubmFtZX1cXG5QbGF0Zm9ybTogJHtkZXZpY2VJbmZvLnBsYXRmb3JtfVxcblRvb2xraXQ6ICR7ZGV2aWNlSW5mby50b29sa2l0fVxcbkNvbXB1dGU6ICR7ZGV2aWNlSW5mby5jb21wdXRlfWApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcnVuT25BbGxQbGF0Zm9ybXM6IHJ1bk9uQWxsUGxhdGZvcm1zLFxuICAgIHJ1bk9uQmVzdERldmljZTogcnVuT25CZXN0RGV2aWNlLFxuICAgIHByaW50RGV2aWNlSW5mbzogcHJpbnREZXZpY2VJbmZvXG59O1xuIl19
