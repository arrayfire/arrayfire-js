"use strict";
"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsV0FBVyxDQUFDO0FBQ1osQUFBSSxFQUFBLENBQUEsUUFBTyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsVUFBUyxDQUFDLENBQUM7QUFDbEMsQUFBSSxFQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsUUFBTyxVQUFVLENBQUM7QUFDOUIsQUFBSSxFQUFBLENBQUEsSUFBRyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsVUFBUyxDQUFDLENBQUM7QUFDOUIsQUFBSSxFQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsV0FBVSxDQUFDLENBQUM7QUFFakMsQUFBTSxFQUFBLENBQUEsY0FBYSxFQUFJLFNBQU8sQ0FBQztBQUUvQixBQUFJLEVBQUEsQ0FBQSxFQUFDLEVBQUksQ0FBQSxLQUFJLEFBQUMsQ0FSZCxlQUFjLHNCQUFzQixBQUFDLENBUXRCLGNBQVUsSUFBRyxDQUFHLENBQUEsVUFBUzs7Ozs7OztBQVJ4QyxPQUFPLENBQVAsZUFBYyx3QkFBd0IsQUFBZCxDQUF4QixTQUFTLElBQUcsQ0FBRztBQUNULFVBQU8sSUFBRzs7O0FBUVosYUFBRyxVQUFVLEFBQUMsQ0FBQyxVQUFTLEdBQUcsQ0FBQyxDQUFDO2tCQUNmLENBQUEsSUFBRyxRQUFRO0FBRXpCLGdCQUFNLElBQUksQUFBQyxDQUFDLDZCQUE0QixDQUFDLENBQUM7QUFDMUMsZUFBSyxnQkFBZ0IsQUFBQyxDQUFDLFVBQVMsQ0FBQyxDQUFDO0FBQ2xDLGdCQUFNLElBQUksQUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDOzs7OztlQUVELENBQUEsSUFBRyxXQUFXLEFBQUMsQ0FBQyxjQUFhLENBQUcsQ0FBQSxJQUFHLE1BQU0sTUFBTSxJQUFJLENBQUM7O1lBaEJ0RSxDQUFBLElBQUcsS0FBSzs7Ozs7ZUFpQlUsQ0FBQSxJQUFHLFdBQVcsQUFBQyxDQUFDLGNBQWEsQ0FBRyxDQUFBLElBQUcsTUFBTSxNQUFNLElBQUksQ0FBQzs7WUFqQnRFLENBQUEsSUFBRyxLQUFLOzs7OztlQWtCYSxDQUFBLElBQUcsVUFBVSxBQUFDLENBQUMsQ0FBQyxDQUFBLElBQUksQUFBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLElBQUksQUFBQyxDQUFDLENBQUEsSUFBSSxBQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQzs7ZUFsQjVELENBQUEsSUFBRyxLQUFLOzs7OztlQW1CbUIsQ0FBQSxJQUFHLFNBQVMsQUFBQyxDQUFDLElBQUcsR0FBRyxBQUFDLENBQUMsQ0FBQSxDQUFDLENBQUM7O3FCQW5CbkQsQ0FBQSxJQUFHLEtBQUs7Ozs7Z0JBb0JRLENBQUEsQ0FBQyxHQUFFLEVBQUssV0FBUyxDQUFDLEVBQUksZUFBYTtBQUUvQyxnQkFBTSxJQUFJLEFBQUMsRUFBQyxPQUFPLEVBQUMsTUFBSSxFQUFHLENBQUM7Ozs7QUF0QmhDLGVBQU8sQ0FBQSxJQUFHLElBQUksQUFBQyxFQUFDLENBQUE7O0FBQ21CLEVBQy9CLE9BQTZCLEtBQUcsQ0FBQyxDQUFDO0FBcUJ0QyxDQXZCdUQsQ0F1QnRELENBQUM7QUFFRixLQUFLLGtCQUFrQixBQUFDLENBQUMsRUFBQyxDQUFHLGFBQVcsQ0FBQyxDQUFDO0FBQzFDIiwiZmlsZSI6ImJlY2htYXJrcy9waS5qcyIsInNvdXJjZVJvb3QiOiJleGFtcGxlcy9lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbmxldCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbmxldCBhc3luYyA9IEJsdWViaXJkLmNvcm91dGluZTtcbmxldCBmaXJlID0gcmVxdWlyZShcIi4uLy4uLy4uXCIpO1xubGV0IGNvbW1vbiA9IHJlcXVpcmUoXCIuLi9jb21tb25cIik7XG5cbmNvbnN0IG51bWJlck9mUG9pbnRzID0gMjAwMDAwMDA7XG5cbmxldCBwaSA9IGFzeW5jKGZ1bmN0aW9uKihmaXJlLCBkZXZpY2VJbmZvKSB7XG4gICAgZmlyZS5zZXREZXZpY2UoZGV2aWNlSW5mby5pZCk7XG4gICAgbGV0IEFGQXJyYXkgPSBmaXJlLkFGQXJyYXk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkNhbGN1bGF0aW5nIHBpIG9uIGRldmljZTpcXG5cIik7XG4gICAgY29tbW9uLnByaW50RGV2aWNlSW5mbyhkZXZpY2VJbmZvKTtcbiAgICBjb25zb2xlLmxvZyhcIlwiKTtcblxuICAgIGxldCB4ID0geWllbGQgZmlyZS5yYW5kdUFzeW5jKG51bWJlck9mUG9pbnRzLCBmaXJlLnR5cGVzLmR0eXBlLmYzMik7XG4gICAgbGV0IHkgPSB5aWVsZCBmaXJlLnJhbmR1QXN5bmMobnVtYmVyT2ZQb2ludHMsIGZpcmUudHlwZXMuZHR5cGUuZjMyKTtcbiAgICBsZXQgZGlzdCA9IHlpZWxkIGZpcmUuc3FydEFzeW5jKCh4Lm11bCh4KSkuYWRkKHkubXVsKHkpKSk7XG4gICAgbGV0IG51bV9pbnNpZGUgPSB5aWVsZCBmaXJlLnN1bUFzeW5jKGRpc3QubHQoMSkpO1xuICAgIGxldCBwaVZhbCA9ICg0LjAgKiAgbnVtX2luc2lkZSkgLyBudW1iZXJPZlBvaW50cztcblxuICAgIGNvbnNvbGUubG9nKGBQSSA9ICR7cGlWYWx9YCk7XG59KTtcblxuY29tbW9uLnJ1bk9uQWxsUGxhdGZyb21zKHBpLCBcInBpIGV4YW1wbGVcIik7XG4iXX0=
