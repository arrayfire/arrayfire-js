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

//# sourceMappingURL=neuralNetwork.js.map
