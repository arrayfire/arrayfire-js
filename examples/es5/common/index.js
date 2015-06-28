"use strict";
"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var af = require("../../..");
var util = require("util");
var now = require("performance-now");
var runOnDevices = async($traceurRuntime.initGeneratorFunction(function $__7(platformID, f) {
  var afOfPlatform,
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
          afOfPlatform = af(platformID);
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
          $__1 = void 0, $__0 = (afOfPlatform.getDevices())[$traceurRuntime.toProperty(Symbol.iterator)]();
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
          platfroms = af.supportedPlatforms();
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
//# sourceMappingURL=data:application/json;base64,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QztBQUVELEtBQUssUUFBUSxFQUFJO0FBQ2Isa0JBQWdCLENBQUcsa0JBQWdCO0FBQ25DLGdCQUFjLENBQUcsZ0JBQWM7QUFBQSxBQUNuQyxDQUFDO0FBQ0QiLCJmaWxlIjoiY29tbW9uL2luZGV4LmpzIiwic291cmNlUm9vdCI6ImV4YW1wbGVzL2VzNiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgQXJyYXlGaXJlXG5Db3B5cmlnaHQgKGMpIDIwMTUgR++/vWJvciBNZXrvv70gYWthIHVuYm9ybmNoaWtrZW4gKGdhYm9yLm1lem9Ab3V0bG9vay5jb20pXG5BbGwgcmlnaHRzIHJlc2VydmVkLlxuXG5SZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuXG4gKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsIHRoaXNcbiAgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG5cbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpc1xuICBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3JcbiAgb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cblxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgQXJyYXlGaXJlIG5vciB0aGUgbmFtZXMgb2YgaXRzXG4gIGNvbnRyaWJ1dG9ycyBtYXkgYmUgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tXG4gIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbldBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbkRJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SXG5BTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVNcbihJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUztcbkxPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTlxuQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlRcbihJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG5TT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiovXG5cblwidXNlIHN0cmljdFwiO1xubGV0IEJsdWViaXJkID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xubGV0IGFmID0gcmVxdWlyZShcIi4uLy4uLy4uXCIpO1xubGV0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcbmxldCBub3cgPSByZXF1aXJlKFwicGVyZm9ybWFuY2Utbm93XCIpO1xuXG5sZXQgcnVuT25EZXZpY2VzID0gYXN5bmMoZnVuY3Rpb24qKHBsYXRmb3JtSUQsIGYpIHtcbiAgICBsZXQgYWZPZlBsYXRmb3JtID0gYWYocGxhdGZvcm1JRCk7XG4gICAgZm9yIChsZXQgZGV2aWNlSW5mbyBvZiBhZk9mUGxhdGZvcm0uZ2V0RGV2aWNlcygpKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gbm93KCk7XG4gICAgICAgIHlpZWxkIGYoYWZPZlBsYXRmb3JtLCBkZXZpY2VJbmZvKTtcbiAgICAgICAgY29uc3QgZW5kID0gbm93KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBcXG4tLSB0b29rICR7KChlbmQgLSBzdGFydCkgLyAxMDAwKS50b0ZpeGVkKDEwKX0gc2Vjb25kc1xcbmApO1xuICAgIH1cbn0pO1xuXG5sZXQgcnVuT25BbGxQbGF0ZnJvbXMgPSBhc3luYyhmdW5jdGlvbiooZiwgbmFtZSkge1xuICAgIGxldCBwbGF0ZnJvbXMgPSBhZi5zdXBwb3J0ZWRQbGF0Zm9ybXMoKTtcbiAgICBjb25zb2xlLmxvZyhgUnVubmluZyAke25hbWV9IG9uIGFsbCBzdXBwb3J0ZWQgcGxhdGZyb21zOiAke3BsYXRmcm9tcy5qb2luKFwiLCBcIil9XFxuYCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZm9yIChsZXQgaWQgb2YgcGxhdGZyb21zKSB7XG4gICAgICAgICAgICB5aWVsZCBydW5PbkRldmljZXMoaWQsIGYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICB9XG59KTtcblxubGV0IHByaW50RGV2aWNlSW5mbyA9IGZ1bmN0aW9uKGRldmljZUluZm8pIHtcbiAgICBjb25zb2xlLmxvZyhgSUQ6ICR7ZGV2aWNlSW5mby5pZH1cXG5OYW1lOiAke2RldmljZUluZm8ubmFtZX1cXG5QbGF0Zm9ybTogJHtkZXZpY2VJbmZvLnBsYXRmb3JtfVxcblRvb2xraXQ6ICR7ZGV2aWNlSW5mby50b29sa2l0fVxcbkNvbXB1dGU6ICR7ZGV2aWNlSW5mby5jb21wdXRlfWApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcnVuT25BbGxQbGF0ZnJvbXM6IHJ1bk9uQWxsUGxhdGZyb21zLFxuICAgIHByaW50RGV2aWNlSW5mbzogcHJpbnREZXZpY2VJbmZvXG59O1xuIl19
