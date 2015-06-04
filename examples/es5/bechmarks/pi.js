"use strict";
"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var asyncSupport = Bluebird.promisifyAll;
var fire = require("../../..");
var common = require("../common");
var numberOfPoints = 20000000;
var pi = async($traceurRuntime.initGeneratorFunction(function $__0(fire, deviceInfo) {
  var AFArray,
      x,
      y,
      dist,
      num_inside,
      piVal;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          fire.setDevice(deviceInfo.id);
          AFArray = fire.AFArray;
          console.log("Calculating pi on device:\n");
          common.printDeviceInfo(deviceInfo);
          console.log("");
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = 2;
          return fire.randuAsync(numberOfPoints, fire.types.dtype.f32);
        case 2:
          x = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $ctx.state = 6;
          return fire.randuAsync(numberOfPoints, fire.types.dtype.f32);
        case 6:
          y = $ctx.sent;
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = 10;
          return fire.sqrtAsync((x.mul(x)).add(y.mul(y)));
        case 10:
          dist = $ctx.sent;
          $ctx.state = 12;
          break;
        case 12:
          $ctx.state = 14;
          return fire.sumAsync(dist.lt(1));
        case 14:
          num_inside = $ctx.sent;
          $ctx.state = 16;
          break;
        case 16:
          piVal = (4.0 * num_inside) / numberOfPoints;
          console.log(("PI = " + piVal));
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__0, this);
}));
common.runOnAllPlatfroms(pi, "pi example");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsV0FBVyxDQUFDO0FBQ1osQUFBSSxFQUFBLENBQUEsUUFBTyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsVUFBUyxDQUFDLENBQUM7QUFDbEMsQUFBSSxFQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsUUFBTyxVQUFVLENBQUM7QUFDOUIsQUFBSSxFQUFBLENBQUEsWUFBVyxFQUFJLENBQUEsUUFBTyxhQUFhLENBQUM7QUFDeEMsQUFBSSxFQUFBLENBQUEsSUFBRyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsVUFBUyxDQUFDLENBQUM7QUFDOUIsQUFBSSxFQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsV0FBVSxDQUFDLENBQUM7QUFFakMsQUFBTSxFQUFBLENBQUEsY0FBYSxFQUFJLFNBQU8sQ0FBQztBQUUvQixBQUFJLEVBQUEsQ0FBQSxFQUFDLEVBQUksQ0FBQSxLQUFJLEFBQUMsQ0FUZCxlQUFjLHNCQUFzQixBQUFDLENBU3RCLGNBQVUsSUFBRyxDQUFHLENBQUEsVUFBUzs7Ozs7OztBQVR4QyxPQUFPLENBQVAsZUFBYyx3QkFBd0IsQUFBZCxDQUF4QixTQUFTLElBQUcsQ0FBRztBQUNULFVBQU8sSUFBRzs7O0FBU1osYUFBRyxVQUFVLEFBQUMsQ0FBQyxVQUFTLEdBQUcsQ0FBQyxDQUFDO2tCQUNmLENBQUEsSUFBRyxRQUFRO0FBRXpCLGdCQUFNLElBQUksQUFBQyxDQUFDLDZCQUE0QixDQUFDLENBQUM7QUFDMUMsZUFBSyxnQkFBZ0IsQUFBQyxDQUFDLFVBQVMsQ0FBQyxDQUFDO0FBQ2xDLGdCQUFNLElBQUksQUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDOzs7OztlQUVELENBQUEsSUFBRyxXQUFXLEFBQUMsQ0FBQyxjQUFhLENBQUcsQ0FBQSxJQUFHLE1BQU0sTUFBTSxJQUFJLENBQUM7O1lBakJ0RSxDQUFBLElBQUcsS0FBSzs7Ozs7ZUFrQlUsQ0FBQSxJQUFHLFdBQVcsQUFBQyxDQUFDLGNBQWEsQ0FBRyxDQUFBLElBQUcsTUFBTSxNQUFNLElBQUksQ0FBQzs7WUFsQnRFLENBQUEsSUFBRyxLQUFLOzs7OztlQW1CYSxDQUFBLElBQUcsVUFBVSxBQUFDLENBQUMsQ0FBQyxDQUFBLElBQUksQUFBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLElBQUksQUFBQyxDQUFDLENBQUEsSUFBSSxBQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQzs7ZUFuQjVELENBQUEsSUFBRyxLQUFLOzs7OztlQW9CbUIsQ0FBQSxJQUFHLFNBQVMsQUFBQyxDQUFDLElBQUcsR0FBRyxBQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7O3FCQXBCbkQsQ0FBQSxJQUFHLEtBQUs7Ozs7Z0JBcUJRLENBQUEsQ0FBQyxHQUFFLEVBQUssV0FBUyxDQUFDLEVBQUksZUFBYTtBQUUvQyxnQkFBTSxJQUFJLEFBQUMsRUFBQyxPQUFPLEVBQUMsTUFBSSxFQUFHLENBQUM7Ozs7QUF2QmhDLGVBQU8sQ0FBQSxJQUFHLElBQUksQUFBQyxFQUFDLENBQUE7O0FBQ21CLEVBQy9CLE9BQTZCLEtBQUcsQ0FBQyxDQUFDO0FBc0J0QyxDQXhCdUQsQ0F3QnRELENBQUM7QUFFRixLQUFLLGtCQUFrQixBQUFDLENBQUMsRUFBQyxDQUFHLGFBQVcsQ0FBQyxDQUFDO0FBQUEiLCJmaWxlIjoiYmVjaG1hcmtzL3BpLmpzIiwic291cmNlUm9vdCI6ImV4YW1wbGVzL2VzNiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5sZXQgQmx1ZWJpcmQgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XHJcbmxldCBhc3luYyA9IEJsdWViaXJkLmNvcm91dGluZTtcclxubGV0IGFzeW5jU3VwcG9ydCA9IEJsdWViaXJkLnByb21pc2lmeUFsbDtcclxubGV0IGZpcmUgPSByZXF1aXJlKFwiLi4vLi4vLi5cIik7XHJcbmxldCBjb21tb24gPSByZXF1aXJlKFwiLi4vY29tbW9uXCIpO1xyXG5cclxuY29uc3QgbnVtYmVyT2ZQb2ludHMgPSAyMDAwMDAwMDtcclxuXHJcbmxldCBwaSA9IGFzeW5jKGZ1bmN0aW9uKihmaXJlLCBkZXZpY2VJbmZvKSB7XHJcbiAgICBmaXJlLnNldERldmljZShkZXZpY2VJbmZvLmlkKTtcclxuICAgIGxldCBBRkFycmF5ID0gZmlyZS5BRkFycmF5O1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiQ2FsY3VsYXRpbmcgcGkgb24gZGV2aWNlOlxcblwiKTtcclxuICAgIGNvbW1vbi5wcmludERldmljZUluZm8oZGV2aWNlSW5mbyk7XHJcbiAgICBjb25zb2xlLmxvZyhcIlwiKTtcclxuXHJcbiAgICBsZXQgeCA9IHlpZWxkIGZpcmUucmFuZHVBc3luYyhudW1iZXJPZlBvaW50cywgZmlyZS50eXBlcy5kdHlwZS5mMzIpO1xyXG4gICAgbGV0IHkgPSB5aWVsZCBmaXJlLnJhbmR1QXN5bmMobnVtYmVyT2ZQb2ludHMsIGZpcmUudHlwZXMuZHR5cGUuZjMyKTtcclxuICAgIGxldCBkaXN0ID0geWllbGQgZmlyZS5zcXJ0QXN5bmMoKHgubXVsKHgpKS5hZGQoeS5tdWwoeSkpKTtcclxuICAgIGxldCBudW1faW5zaWRlID0geWllbGQgZmlyZS5zdW1Bc3luYyhkaXN0Lmx0KDEpKTtcclxuICAgIGxldCBwaVZhbCA9ICg0LjAgKiAgbnVtX2luc2lkZSkgLyBudW1iZXJPZlBvaW50cztcclxuXHJcbiAgICBjb25zb2xlLmxvZyhgUEkgPSAke3BpVmFsfWApO1xyXG59KTtcclxuXHJcbmNvbW1vbi5ydW5PbkFsbFBsYXRmcm9tcyhwaSwgXCJwaSBleGFtcGxlXCIpOyJdfQ==
