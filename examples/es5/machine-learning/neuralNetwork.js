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
//# sourceMappingURL=data:application/json;base64,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WUFBVSxDQUFDOzs7OztBQXREMUYsc0JBQXVCOztnQkFBdkIsQ0FBQSxJQUFHLEtBQUs7Ozs7Z0JBc0RzQyxjQUFxRDtnQkFBckQsV0FBc0QsT0FBQyxFQUFBLENBQUM7Z0JBQXRGLDhCQUE2QjtnQkFBekMsV0FBVyxDQUFYLE9BQU0sUUFBK0Y7Ozs7QUFFckcsZ0JBQU0sSUFBSSxBQUFDLENBQUMsV0FBVSxDQUFDLENBQUM7Ozs7Z0JBQ3hCLENBQUEsT0FBTSxJQUFJO2dCQUF1QyxDQUFBLFFBQU8sQUFBQyxDQUFDLEVBQUMsQ0FBRyxXQUFTLENBQUcsV0FBUyxDQUFDOzs7OztBQXpEeEYsc0JBQXVCOztnQkFBdkIsQ0FBQSxJQUFHLEtBQUs7Ozs7Z0JBeURzQyxjQUFtRDtnQkFBbkQsV0FBb0QsT0FBQyxFQUFBLENBQUM7Z0JBQXBGLDhCQUE2QjtnQkFBekMsV0FBVyxDQUFYLE9BQU0sUUFBNkY7Ozs7QUFFbkcsZ0JBQU0sSUFBSSxBQUFDLEVBQUMsaUJBQWlCLEVBQUMsQ0FBQSxDQUFDLENBQUMsR0FBRSxFQUFJLE1BQUksQ0FBQyxFQUFJLEtBQUcsQ0FBQyxRQUFRLEFBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQSxDQUFDLGFBQVcsRUFBQyxDQUFDOzs7O0FBM0RqRixlQUFPLENBQUEsSUFBRyxJQUFJLEFBQUMsRUFBQyxDQUFBOztBQUNtQixFQUMvQixRQUE2QixLQUFHLENBQUMsQ0FBQztBQTBEdEMsQ0E1RHVELENBNER0RCxDQUFDO0FBRUYsS0FBSyxnQkFBZ0IsQUFBQyxDQUFDLE9BQU0sQ0FBRyxXQUFTLENBQUMsQ0FBQztBQUFBIiwiZmlsZSI6Im1hY2hpbmUtbGVhcm5pbmcvbmV1cmFsTmV0d29yay5qcyIsInNvdXJjZVJvb3QiOiJleGFtcGxlcy9lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxubGV0IEJsdWViaXJkID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xubGV0IGNvbW1vbiA9IHJlcXVpcmUoXCIuLi9jb21tb25cIik7XG5sZXQgbW5pc3QgPSByZXF1aXJlKFwiLi9tbmlzdFwiKTtcbmxldCBBTk4gPSByZXF1aXJlKFwiLi9hbm5cIik7XG5sZXQgbm93ID0gcmVxdWlyZShcInBlcmZvcm1hbmNlLW5vd1wiKTtcblxubGV0IGFjY3VyYWN5ID0gYXN5bmMoZnVuY3Rpb24qKGFmLCBwcmVkaWN0ZWQsIHRhcmdldCkge1xuICAgIGxldCBwTWF4ID0geWllbGQgYWYuZmluZE1heEF0QXN5bmMocHJlZGljdGVkLCAxKTtcbiAgICBsZXQgdE1heCA9IHlpZWxkIGFmLmZpbmRNYXhBdEFzeW5jKHRhcmdldCwgMSk7XG4gICAgcmV0dXJuICgxMDAgKiAoeWllbGQgYWYuY291bnRBc3luYyhwTWF4LmluZGV4LmVxKHRNYXguaW5kZXgpKSkpIC8gdE1heC5pbmRleC5lbGVtZW50cygpO1xufSk7XG5cbmxldCBhbm5EZW1vID0gYXN5bmMoZnVuY3Rpb24qKGFmLCBkZXZpY2VJbmZvKSB7XG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nIEFOTiBEZW1vIG9uIGRldmljZTpcXG5cIik7XG4gICAgY29tbW9uLnByaW50RGV2aWNlSW5mbyhkZXZpY2VJbmZvKTtcbiAgICBjb25zb2xlLmxvZyhcIlwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyB1cCB0cmFpbmluZyBkYXRhLlwiKTtcbiAgICBsZXQgZGF0YSA9IHlpZWxkIG1uaXN0LnNldHVwKGFmLCB0cnVlLCAwLjYpO1xuXG4gICAgbGV0IGZlYXR1cmVTaXplID0gZGF0YS50cmFpbkltYWdlcy5lbGVtZW50cygpIC8gZGF0YS5udW1UcmFpbjtcblxuICAgIC8vIFJlc2hhcGUgaW1hZ2VzIGludG8gZmVhdHVyZSB2ZWN0b3JzXG4gICAgbGV0IHRyYWluRmVhdHMgPSBhZi50cmFuc3Bvc2UoYWYubW9kRGltcyhkYXRhLnRyYWluSW1hZ2VzLCBmZWF0dXJlU2l6ZSwgZGF0YS5udW1UcmFpbikpO1xuICAgIGxldCB0ZXN0RmVhdHMgPSBhZi50cmFuc3Bvc2UoYWYubW9kRGltcyhkYXRhLnRlc3RJbWFnZXMsIGZlYXR1cmVTaXplLCBkYXRhLm51bVRlc3QpKTtcblxuICAgIGxldCB0cmFpblRhcmdldCA9IGFmLnRyYW5zcG9zZShkYXRhLnRyYWluTGFiZWxzKTtcbiAgICBsZXQgdGVzdFRhcmdldCA9IGFmLnRyYW5zcG9zZShkYXRhLnRlc3RMYWJlbHMpO1xuXG4gICAgbGV0IG5ldHdvcmsgPSBuZXcgQU5OKGFmLCBbdHJhaW5GZWF0cy5kaW1zKDEpLCAxMDAsIDUwLCBkYXRhLm51bUNsYXNzZXNdKTtcblxuICAgIC8vIFRyYWluIG5ldHdvcmtcbiAgICBjb25zdCBzdGFydCA9IG5vdygpO1xuICAgIHlpZWxkIG5ldHdvcmsudHJhaW4oXG4gICAgICAgIHRyYWluRmVhdHMsXG4gICAgICAgIHRyYWluVGFyZ2V0LFxuICAgICAgICB7XG4gICAgICAgICAgICBhbHBoYTogMi4wLFxuICAgICAgICAgICAgbWF4RXBvY2hzOiAyNTAsXG4gICAgICAgICAgICBiYXRjaFNpemU6IDEwMCxcbiAgICAgICAgICAgIG1heEVycm9yOiAwLjVcbiAgICAgICAgfVxuICAgICk7XG4gICAgeWllbGQgYWYud2FpdEFzeW5jKCk7XG4gICAgY29uc3QgZW5kID0gbm93KCk7XG5cbiAgICAvLyBSdW4gdGhlIHRyYWluZWQgbmV0d29yayBhbmQgdGVzdCBhY2N1cmFjeS5cbiAgICBsZXQgdHJhaW5PdXRwdXQgPSBuZXR3b3JrLnByZWRpY3QodHJhaW5GZWF0cyk7XG4gICAgbGV0IHRlc3RPdXRwdXQgPSBuZXR3b3JrLnByZWRpY3QodGVzdEZlYXRzKTtcblxuICAgIGNvbnNvbGUubG9nKFwiVHJhaW5pbmcgc2V0OlwiKTtcbiAgICBjb25zb2xlLmxvZyhgQWNjdXJhY3kgb24gdHJhaW5pbmcgZGF0YTogJHsoeWllbGQgYWNjdXJhY3koYWYsIHRyYWluT3V0cHV0LCB0cmFpblRhcmdldCkpLnRvRml4ZWQoMil9YCk7XG5cbiAgICBjb25zb2xlLmxvZyhcIlRlc3Qgc2V0OlwiKTtcbiAgICBjb25zb2xlLmxvZyhgQWNjdXJhY3kgb24gdGVzdGluZyAgZGF0YTogJHsoeWllbGQgYWNjdXJhY3koYWYsIHRlc3RPdXRwdXQsIHRlc3RUYXJnZXQpKS50b0ZpeGVkKDIpfWApO1xuXG4gICAgY29uc29sZS5sb2coYFRyYWluaW5nIHRpbWU6ICR7KChlbmQgLSBzdGFydCkgLyAxMDAwKS50b0ZpeGVkKDEwKX0gc2Vjb25kc1xcbmApO1xufSk7XG5cbmNvbW1vbi5ydW5PbkJlc3REZXZpY2UoYW5uRGVtbywgXCJBTk4gRGVtb1wiKTsiXX0=
