"use strict";
"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var common = require("../common");
var mnist = require("./mnist");
var ANN = require("./ann");
var now = require("performance-now");
var accuracy = async($traceurRuntime.initGeneratorFunction(function $__0(af, predicted, target) {
  var pMax,
      tMax,
      $__1,
      $__2,
      $__3,
      $__4,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = 2;
          return af.findMaxAtAsync(predicted, 1);
        case 2:
          pMax = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $ctx.state = 6;
          return af.findMaxAtAsync(target, 1);
        case 6:
          tMax = $ctx.sent;
          $ctx.state = 8;
          break;
        case 8:
          $__1 = af.countAsync;
          $__2 = pMax.index;
          $__3 = $__2.eq;
          $__4 = tMax.index;
          $__5 = $__3.call($__2, $__4);
          $__6 = $__1.call(af, $__5);
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = 10;
          return $__6;
        case 10:
          $__7 = $ctx.sent;
          $ctx.state = 12;
          break;
        case 12:
          $__8 = 100 * $__7;
          $__9 = tMax.index;
          $__10 = $__9.elements;
          $__11 = $__10.call($__9);
          $ctx.state = 16;
          break;
        case 16:
          $ctx.returnValue = $__8 / $__11;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__0, this);
}));
var annDemo = async($traceurRuntime.initGeneratorFunction(function $__12(af, deviceInfo) {
  var data,
      featureSize,
      trainFeats,
      testFeats,
      trainTarget,
      testTarget,
      network,
      start,
      end,
      trainOutput,
      testOutput,
      $__13,
      $__14,
      $__15,
      $__16,
      $__17,
      $__18,
      $__19,
      $__20,
      $__21,
      $__22,
      $__23,
      $__24,
      $__25,
      $__26;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          console.log("Running ANN Demo on device:\n");
          common.printDeviceInfo(deviceInfo);
          console.log("");
          console.log("Setting up training data.");
          $ctx.state = 30;
          break;
        case 30:
          $ctx.state = 2;
          return mnist.setup(af, true, 0.6);
        case 2:
          data = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          featureSize = data.trainImages.elements() / data.numTrain;
          trainFeats = af.transpose(af.modDims(data.trainImages, featureSize, data.numTrain));
          testFeats = af.transpose(af.modDims(data.testImages, featureSize, data.numTest));
          trainTarget = af.transpose(data.trainLabels);
          testTarget = af.transpose(data.testLabels);
          network = new ANN(af, [trainFeats.dims(1), 100, 50, data.numClasses]);
          start = now();
          $ctx.state = 32;
          break;
        case 32:
          $ctx.state = 6;
          return network.train(trainFeats, trainTarget, {
            alpha: 2.0,
            maxEpochs: 250,
            batchSize: 100,
            maxError: 0.5
          });
        case 6:
          $ctx.maybeThrow();
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = 10;
          return af.waitAsync();
        case 10:
          $ctx.maybeThrow();
          $ctx.state = 12;
          break;
        case 12:
          end = now();
          trainOutput = network.predict(trainFeats);
          testOutput = network.predict(testFeats);
          console.log("Training set:");
          $ctx.state = 34;
          break;
        case 34:
          $__13 = console.log;
          $__14 = accuracy(af, trainOutput, trainTarget);
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = 14;
          return $__14;
        case 14:
          $__15 = $ctx.sent;
          $ctx.state = 16;
          break;
        case 16:
          $__16 = $__15.toFixed;
          $__17 = $__16.call($__15, 2);
          $__18 = "Accuracy on training data: " + $__17;
          $__19 = $__13.call(console, $__18);
          $ctx.state = 20;
          break;
        case 20:
          console.log("Test set:");
          $ctx.state = 36;
          break;
        case 36:
          $__20 = console.log;
          $__21 = accuracy(af, testOutput, testTarget);
          $ctx.state = 26;
          break;
        case 26:
          $ctx.state = 22;
          return $__21;
        case 22:
          $__22 = $ctx.sent;
          $ctx.state = 24;
          break;
        case 24:
          $__23 = $__22.toFixed;
          $__24 = $__23.call($__22, 2);
          $__25 = "Accuracy on testing  data: " + $__24;
          $__26 = $__20.call(console, $__25);
          $ctx.state = 28;
          break;
        case 28:
          console.log(("Training time: " + ((end - start) / 1000).toFixed(10) + " seconds\n"));
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__12, this);
}));
common.runOnBestDevice(annDemo, "ANN Demo");
//# sourceMappingURL=data:application/json;base64,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QSxDQUFDO2dCQUF0Riw4QkFBNkI7Z0JBQXpDLFdBQVcsQ0FBWCxPQUFNLFFBQStGOzs7O0FBRXJHLGdCQUFNLElBQUksQUFBQyxDQUFDLFdBQVUsQ0FBQyxDQUFDOzs7O2dCQUN4QixDQUFBLE9BQU0sSUFBSTtnQkFBdUMsQ0FBQSxRQUFPLEFBQUMsQ0FBQyxFQUFDLENBQUcsV0FBUyxDQUFHLFdBQVMsQ0FBQzs7Ozs7OztnQkF6RHhGLENBQUEsSUFBRyxLQUFLOzs7O2dCQXlEc0MsY0FBbUQ7Z0JBQW5ELFdBQW9ELE9BQUMsRUFBQSxDQUFDO2dCQUFwRiw4QkFBNkI7Z0JBQXpDLFdBQVcsQ0FBWCxPQUFNLFFBQTZGOzs7O0FBRW5HLGdCQUFNLElBQUksQUFBQyxFQUFDLGlCQUFpQixFQUFDLENBQUEsQ0FBQyxDQUFDLEdBQUUsRUFBSSxNQUFJLENBQUMsRUFBSSxLQUFHLENBQUMsUUFBUSxBQUFDLENBQUMsRUFBQyxDQUFDLENBQUEsQ0FBQyxhQUFXLEVBQUMsQ0FBQzs7OztBQTNEakYsZUFBTyxDQUFBLElBQUcsSUFBSSxBQUFDLEVBQUMsQ0FBQTs7QUFDbUIsRUFDL0IsUUFBNkIsS0FBRyxDQUFDLENBQUM7QUEwRHRDLENBNUR1RCxDQTREdEQsQ0FBQztBQUVGLEtBQUssZ0JBQWdCLEFBQUMsQ0FBQyxPQUFNLENBQUcsV0FBUyxDQUFDLENBQUM7QUFBQSIsImZpbGUiOiJtYWNoaW5lLWxlYXJuaW5nL25ldXJhbE5ldHdvcmsuanMiLCJzb3VyY2VSb290IjoiZXhhbXBsZXMvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbmxldCBhc3luYyA9IEJsdWViaXJkLmNvcm91dGluZTtcbmxldCBjb21tb24gPSByZXF1aXJlKFwiLi4vY29tbW9uXCIpO1xubGV0IG1uaXN0ID0gcmVxdWlyZShcIi4vbW5pc3RcIik7XG5sZXQgQU5OID0gcmVxdWlyZShcIi4vYW5uXCIpO1xubGV0IG5vdyA9IHJlcXVpcmUoXCJwZXJmb3JtYW5jZS1ub3dcIik7XG5cbmxldCBhY2N1cmFjeSA9IGFzeW5jKGZ1bmN0aW9uKihhZiwgcHJlZGljdGVkLCB0YXJnZXQpIHtcbiAgICBsZXQgcE1heCA9IHlpZWxkIGFmLmZpbmRNYXhBdEFzeW5jKHByZWRpY3RlZCwgMSk7XG4gICAgbGV0IHRNYXggPSB5aWVsZCBhZi5maW5kTWF4QXRBc3luYyh0YXJnZXQsIDEpO1xuICAgIHJldHVybiAoMTAwICogKHlpZWxkIGFmLmNvdW50QXN5bmMocE1heC5pbmRleC5lcSh0TWF4LmluZGV4KSkpKSAvIHRNYXguaW5kZXguZWxlbWVudHMoKTtcbn0pO1xuXG5sZXQgYW5uRGVtbyA9IGFzeW5jKGZ1bmN0aW9uKihhZiwgZGV2aWNlSW5mbykge1xuICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBBTk4gRGVtbyBvbiBkZXZpY2U6XFxuXCIpO1xuICAgIGNvbW1vbi5wcmludERldmljZUluZm8oZGV2aWNlSW5mbyk7XG4gICAgY29uc29sZS5sb2coXCJcIik7XG5cbiAgICBjb25zb2xlLmxvZyhcIlNldHRpbmcgdXAgdHJhaW5pbmcgZGF0YS5cIik7XG4gICAgbGV0IGRhdGEgPSB5aWVsZCBtbmlzdC5zZXR1cChhZiwgdHJ1ZSwgMC42KTtcblxuICAgIGxldCBmZWF0dXJlU2l6ZSA9IGRhdGEudHJhaW5JbWFnZXMuZWxlbWVudHMoKSAvIGRhdGEubnVtVHJhaW47XG5cbiAgICAvLyBSZXNoYXBlIGltYWdlcyBpbnRvIGZlYXR1cmUgdmVjdG9yc1xuICAgIGxldCB0cmFpbkZlYXRzID0gYWYudHJhbnNwb3NlKGFmLm1vZERpbXMoZGF0YS50cmFpbkltYWdlcywgZmVhdHVyZVNpemUsIGRhdGEubnVtVHJhaW4pKTtcbiAgICBsZXQgdGVzdEZlYXRzID0gYWYudHJhbnNwb3NlKGFmLm1vZERpbXMoZGF0YS50ZXN0SW1hZ2VzLCBmZWF0dXJlU2l6ZSwgZGF0YS5udW1UZXN0KSk7XG5cbiAgICBsZXQgdHJhaW5UYXJnZXQgPSBhZi50cmFuc3Bvc2UoZGF0YS50cmFpbkxhYmVscyk7XG4gICAgbGV0IHRlc3RUYXJnZXQgPSBhZi50cmFuc3Bvc2UoZGF0YS50ZXN0TGFiZWxzKTtcblxuICAgIGxldCBuZXR3b3JrID0gbmV3IEFOTihhZiwgW3RyYWluRmVhdHMuZGltcygxKSwgMTAwLCA1MCwgZGF0YS5udW1DbGFzc2VzXSk7XG5cbiAgICAvLyBUcmFpbiBuZXR3b3JrXG4gICAgY29uc3Qgc3RhcnQgPSBub3coKTtcbiAgICB5aWVsZCBuZXR3b3JrLnRyYWluKFxuICAgICAgICB0cmFpbkZlYXRzLFxuICAgICAgICB0cmFpblRhcmdldCxcbiAgICAgICAge1xuICAgICAgICAgICAgYWxwaGE6IDIuMCxcbiAgICAgICAgICAgIG1heEVwb2NoczogMjUwLFxuICAgICAgICAgICAgYmF0Y2hTaXplOiAxMDAsXG4gICAgICAgICAgICBtYXhFcnJvcjogMC41XG4gICAgICAgIH1cbiAgICApO1xuICAgIHlpZWxkIGFmLndhaXRBc3luYygpO1xuICAgIGNvbnN0IGVuZCA9IG5vdygpO1xuXG4gICAgLy8gUnVuIHRoZSB0cmFpbmVkIG5ldHdvcmsgYW5kIHRlc3QgYWNjdXJhY3kuXG4gICAgbGV0IHRyYWluT3V0cHV0ID0gbmV0d29yay5wcmVkaWN0KHRyYWluRmVhdHMpO1xuICAgIGxldCB0ZXN0T3V0cHV0ID0gbmV0d29yay5wcmVkaWN0KHRlc3RGZWF0cyk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlRyYWluaW5nIHNldDpcIik7XG4gICAgY29uc29sZS5sb2coYEFjY3VyYWN5IG9uIHRyYWluaW5nIGRhdGE6ICR7KHlpZWxkIGFjY3VyYWN5KGFmLCB0cmFpbk91dHB1dCwgdHJhaW5UYXJnZXQpKS50b0ZpeGVkKDIpfWApO1xuXG4gICAgY29uc29sZS5sb2coXCJUZXN0IHNldDpcIik7XG4gICAgY29uc29sZS5sb2coYEFjY3VyYWN5IG9uIHRlc3RpbmcgIGRhdGE6ICR7KHlpZWxkIGFjY3VyYWN5KGFmLCB0ZXN0T3V0cHV0LCB0ZXN0VGFyZ2V0KSkudG9GaXhlZCgyKX1gKTtcblxuICAgIGNvbnNvbGUubG9nKGBUcmFpbmluZyB0aW1lOiAkeygoZW5kIC0gc3RhcnQpIC8gMTAwMCkudG9GaXhlZCgxMCl9IHNlY29uZHNcXG5gKTtcbn0pO1xuXG5jb21tb24ucnVuT25CZXN0RGV2aWNlKGFubkRlbW8sIFwiQU5OIERlbW9cIik7Il19
