"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var common = require("../common");
var numberOfPoints = 20000000;
var pi = async($traceurRuntime.initGeneratorFunction(function $__0(af, deviceInfo) {
  var AFArray,
      x,
      y,
      dist,
      numInside,
      piVal;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          AFArray = af.AFArray;
          console.log("Calculating pi on device:\n");
          common.printDeviceInfo(deviceInfo);
          console.log("");
          x = af.randu(numberOfPoints, af.dtype.f32);
          y = af.randu(numberOfPoints, af.dtype.f32);
          dist = af.sqrt(x.mul(x).add(y.mul(y)));
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return af.sumAsync(dist.lt(1));
        case 2:
          numInside = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          piVal = (4.0 * numInside) / numberOfPoints;
          console.log(("PI = " + piVal));
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__0, this);
}));
common.runOnAllPlatforms(pi, "pi example");

//# sourceMappingURL=pi.js.map
