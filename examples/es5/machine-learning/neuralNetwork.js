"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var common = require("../common");
var mnist = require("./mnist");
var ANN = require("./ann");
var now = require("performance-now");
var accuracy = async($traceurRuntime.initGeneratorFunction(function $__1(af, predicted, target) {
  var pMax,
      tMax,
      $__2,
      $__3,
      $__4,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11,
      $__12;
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
          $__2 = af.countAsync;
          $__3 = pMax.index;
          $__4 = $__3.eq;
          $__5 = tMax.index;
          $__6 = $__4.call($__3, $__5);
          $__7 = $__2.call(af, $__6);
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = 10;
          return $__7;
        case 10:
          $__8 = $ctx.sent;
          $ctx.state = 12;
          break;
        case 12:
          $__9 = 100 * $__8;
          $__10 = tMax.index;
          $__11 = $__10.elements;
          $__12 = $__11.call($__10);
          $ctx.state = 16;
          break;
        case 16:
          $ctx.returnValue = $__9 / $__12;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__1, this);
}));
var annDemo = async($traceurRuntime.initGeneratorFunction(function $__13(af, deviceInfo) {
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
      $__26,
      $__27;
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
            alpha: 1.0,
            maxEpochs: 300,
            batchSize: 100,
            maxError: 1.0
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
          $__14 = console.log;
          $__15 = accuracy(af, trainOutput, trainTarget);
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = 14;
          return $__15;
        case 14:
          $__16 = $ctx.sent;
          $ctx.state = 16;
          break;
        case 16:
          $__17 = $__16.toFixed;
          $__18 = $__17.call($__16, 2);
          $__19 = "Accuracy on training data: " + $__18;
          $__20 = $__14.call(console, $__19);
          $ctx.state = 20;
          break;
        case 20:
          console.log("Test set:");
          $ctx.state = 36;
          break;
        case 36:
          $__21 = console.log;
          $__22 = accuracy(af, testOutput, testTarget);
          $ctx.state = 26;
          break;
        case 26:
          $ctx.state = 22;
          return $__22;
        case 22:
          $__23 = $ctx.sent;
          $ctx.state = 24;
          break;
        case 24:
          $__24 = $__23.toFixed;
          $__25 = $__24.call($__23, 2);
          $__26 = "Accuracy on testing  data: " + $__25;
          $__27 = $__21.call(console, $__26);
          $ctx.state = 28;
          break;
        case 28:
          console.log(("Training time: " + ((end - start) / 1000).toFixed(10) + " seconds\n"));
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__13, this);
}));
common.runOnBestDevice(annDemo, "ANN Demo");
//# sourceMappingURL=data:application/json;base64,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OEJBQTZCO2dCQUF6QyxXQUFXLENBQVgsT0FBTSxRQUErRjs7OztBQUVyRyxnQkFBTSxJQUFJLEFBQUMsQ0FBQyxXQUFVLENBQUMsQ0FBQzs7OztnQkFDeEIsQ0FBQSxPQUFNLElBQUk7Z0JBQXVDLENBQUEsUUFBTyxBQUFDLENBQUMsRUFBQyxDQUFHLFdBQVMsQ0FBRyxXQUFTLENBQUM7Ozs7Ozs7Z0JBekR4RixDQUFBLElBQUcsS0FBSzs7OztnQkF5RHNDLGNBQW1EO2dCQUFuRCxXQUFvRCxPQUFDLEVBQUEsQ0FBQztnQkFBcEYsOEJBQTZCO2dCQUF6QyxXQUFXLENBQVgsT0FBTSxRQUE2Rjs7OztBQUVuRyxnQkFBTSxJQUFJLEFBQUMsRUFBQyxpQkFBaUIsRUFBQyxDQUFBLENBQUMsQ0FBQyxHQUFFLEVBQUksTUFBSSxDQUFDLEVBQUksS0FBRyxDQUFDLFFBQVEsQUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFBLENBQUMsYUFBVyxFQUFDLENBQUM7Ozs7QUEzRGpGLGVBQU8sQ0FBQSxJQUFHLElBQUksQUFBQyxFQUFDLENBQUE7O0FBQ21CLEVBQy9CLFFBQTZCLEtBQUcsQ0FBQyxDQUFDO0FBMER0QyxDQTVEdUQsQ0E0RHRELENBQUM7QUFFRixLQUFLLGdCQUFnQixBQUFDLENBQUMsT0FBTSxDQUFHLFdBQVMsQ0FBQyxDQUFDO0FBQUEiLCJmaWxlIjoibWFjaGluZS1sZWFybmluZy9uZXVyYWxOZXR3b3JrLmpzIiwic291cmNlUm9vdCI6ImV4YW1wbGVzL2VzNiIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5sZXQgQmx1ZWJpcmQgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XG5sZXQgYXN5bmMgPSBCbHVlYmlyZC5jb3JvdXRpbmU7XG5sZXQgY29tbW9uID0gcmVxdWlyZShcIi4uL2NvbW1vblwiKTtcbmxldCBtbmlzdCA9IHJlcXVpcmUoXCIuL21uaXN0XCIpO1xubGV0IEFOTiA9IHJlcXVpcmUoXCIuL2FublwiKTtcbmxldCBub3cgPSByZXF1aXJlKFwicGVyZm9ybWFuY2Utbm93XCIpO1xuXG5sZXQgYWNjdXJhY3kgPSBhc3luYyhmdW5jdGlvbiooYWYsIHByZWRpY3RlZCwgdGFyZ2V0KSB7XG4gICAgbGV0IHBNYXggPSB5aWVsZCBhZi5maW5kTWF4QXRBc3luYyhwcmVkaWN0ZWQsIDEpO1xuICAgIGxldCB0TWF4ID0geWllbGQgYWYuZmluZE1heEF0QXN5bmModGFyZ2V0LCAxKTtcbiAgICByZXR1cm4gKDEwMCAqICh5aWVsZCBhZi5jb3VudEFzeW5jKHBNYXguaW5kZXguZXEodE1heC5pbmRleCkpKSkgLyB0TWF4LmluZGV4LmVsZW1lbnRzKCk7XG59KTtcblxubGV0IGFubkRlbW8gPSBhc3luYyhmdW5jdGlvbiooYWYsIGRldmljZUluZm8pIHtcbiAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgQU5OIERlbW8gb24gZGV2aWNlOlxcblwiKTtcbiAgICBjb21tb24ucHJpbnREZXZpY2VJbmZvKGRldmljZUluZm8pO1xuICAgIGNvbnNvbGUubG9nKFwiXCIpO1xuXG4gICAgY29uc29sZS5sb2coXCJTZXR0aW5nIHVwIHRyYWluaW5nIGRhdGEuXCIpO1xuICAgIGxldCBkYXRhID0geWllbGQgbW5pc3Quc2V0dXAoYWYsIHRydWUsIDAuNik7XG5cbiAgICBsZXQgZmVhdHVyZVNpemUgPSBkYXRhLnRyYWluSW1hZ2VzLmVsZW1lbnRzKCkgLyBkYXRhLm51bVRyYWluO1xuXG4gICAgLy8gUmVzaGFwZSBpbWFnZXMgaW50byBmZWF0dXJlIHZlY3RvcnNcbiAgICBsZXQgdHJhaW5GZWF0cyA9IGFmLnRyYW5zcG9zZShhZi5tb2REaW1zKGRhdGEudHJhaW5JbWFnZXMsIGZlYXR1cmVTaXplLCBkYXRhLm51bVRyYWluKSk7XG4gICAgbGV0IHRlc3RGZWF0cyA9IGFmLnRyYW5zcG9zZShhZi5tb2REaW1zKGRhdGEudGVzdEltYWdlcywgZmVhdHVyZVNpemUsIGRhdGEubnVtVGVzdCkpO1xuXG4gICAgbGV0IHRyYWluVGFyZ2V0ID0gYWYudHJhbnNwb3NlKGRhdGEudHJhaW5MYWJlbHMpO1xuICAgIGxldCB0ZXN0VGFyZ2V0ID0gYWYudHJhbnNwb3NlKGRhdGEudGVzdExhYmVscyk7XG5cbiAgICBsZXQgbmV0d29yayA9IG5ldyBBTk4oYWYsIFt0cmFpbkZlYXRzLmRpbXMoMSksIDEwMCwgNTAsIGRhdGEubnVtQ2xhc3Nlc10pO1xuXG4gICAgLy8gVHJhaW4gbmV0d29ya1xuICAgIGNvbnN0IHN0YXJ0ID0gbm93KCk7XG4gICAgeWllbGQgbmV0d29yay50cmFpbihcbiAgICAgICAgdHJhaW5GZWF0cyxcbiAgICAgICAgdHJhaW5UYXJnZXQsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFscGhhOiAxLjAsXG4gICAgICAgICAgICBtYXhFcG9jaHM6IDMwMCxcbiAgICAgICAgICAgIGJhdGNoU2l6ZTogMTAwLFxuICAgICAgICAgICAgbWF4RXJyb3I6IDEuMFxuICAgICAgICB9XG4gICAgKTtcbiAgICB5aWVsZCBhZi53YWl0QXN5bmMoKTtcbiAgICBjb25zdCBlbmQgPSBub3coKTtcblxuICAgIC8vIFJ1biB0aGUgdHJhaW5lZCBuZXR3b3JrIGFuZCB0ZXN0IGFjY3VyYWN5LlxuICAgIGxldCB0cmFpbk91dHB1dCA9IG5ldHdvcmsucHJlZGljdCh0cmFpbkZlYXRzKTtcbiAgICBsZXQgdGVzdE91dHB1dCA9IG5ldHdvcmsucHJlZGljdCh0ZXN0RmVhdHMpO1xuXG4gICAgY29uc29sZS5sb2coXCJUcmFpbmluZyBzZXQ6XCIpO1xuICAgIGNvbnNvbGUubG9nKGBBY2N1cmFjeSBvbiB0cmFpbmluZyBkYXRhOiAkeyh5aWVsZCBhY2N1cmFjeShhZiwgdHJhaW5PdXRwdXQsIHRyYWluVGFyZ2V0KSkudG9GaXhlZCgyKX1gKTtcblxuICAgIGNvbnNvbGUubG9nKFwiVGVzdCBzZXQ6XCIpO1xuICAgIGNvbnNvbGUubG9nKGBBY2N1cmFjeSBvbiB0ZXN0aW5nICBkYXRhOiAkeyh5aWVsZCBhY2N1cmFjeShhZiwgdGVzdE91dHB1dCwgdGVzdFRhcmdldCkpLnRvRml4ZWQoMil9YCk7XG5cbiAgICBjb25zb2xlLmxvZyhgVHJhaW5pbmcgdGltZTogJHsoKGVuZCAtIHN0YXJ0KSAvIDEwMDApLnRvRml4ZWQoMTApfSBzZWNvbmRzXFxuYCk7XG59KTtcblxuY29tbW9uLnJ1bk9uQmVzdERldmljZShhbm5EZW1vLCBcIkFOTiBEZW1vXCIpOyJdfQ==
