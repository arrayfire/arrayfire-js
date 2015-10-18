"use strict";
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var fs = Bluebird.promisifyAll(require("fs-extra"));
var ref = require("ref");
var float = ref.types.float;
var uint = ref.types.uint;
var debug = require("debug")("af:mnist");
var _ = require("lodash");
var assert = require("better-assert");
var path = require("path");
var readData = async($traceurRuntime.initGeneratorFunction(function $__5(f, data) {
  var bytesRead,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $__6 = fs.readAsync;
          $__7 = data.length;
          $__8 = $__6.call(fs, f, data, 0, $__7, null);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__8;
        case 2:
          $__9 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__10 = $__9[0];
          bytesRead = $__10;
          $ctx.state = 8;
          break;
        case 8:
          if (bytesRead !== data.length) {
            throw new Error("File reading error!");
          }
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__5, this);
}));
var readIdx = async($traceurRuntime.initGeneratorFunction(function $__11(path, type) {
  var file,
      d,
      numDims,
      elem,
      dims,
      i,
      dim,
      bdata,
      data,
      i$__1,
      byte;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = 2;
          return fs.openAsync(path, "r");
        case 2:
          file = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $ctx.pushTry(null, 37);
          $ctx.state = 39;
          break;
        case 39:
          d = new Buffer(4);
          $ctx.state = 25;
          break;
        case 25:
          $ctx.state = 6;
          return readData(file, d);
        case 6:
          $ctx.maybeThrow();
          $ctx.state = 8;
          break;
        case 8:
          if (d[2] != 8) {
            throw new Error("Unsupported data type");
          }
          numDims = d[3];
          elem = 1;
          dims = [];
          $ctx.state = 27;
          break;
        case 27:
          i = 0;
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = (i < numDims) ? 9 : 15;
          break;
        case 14:
          i++;
          $ctx.state = 17;
          break;
        case 9:
          $ctx.state = 10;
          return readData(file, d);
        case 10:
          $ctx.maybeThrow();
          $ctx.state = 12;
          break;
        case 12:
          dim = d.readUInt32BE();
          elem *= dim;
          dims.push(dim);
          $ctx.state = 14;
          break;
        case 15:
          bdata = new Buffer(elem);
          $ctx.state = 29;
          break;
        case 29:
          $ctx.state = 19;
          return readData(file, bdata);
        case 19:
          $ctx.maybeThrow();
          $ctx.state = 21;
          break;
        case 21:
          data = new Buffer(bdata.length * type.size);
          for (i$__1 = 0; i$__1 < bdata.length; i$__1++) {
            byte = bdata[i$__1];
            type.set(data, i$__1 * type.size, byte);
          }
          $ctx.state = 31;
          break;
        case 31:
          $ctx.returnValue = {
            numDims: numDims,
            dims: dims,
            data: data
          };
          $ctx.state = 37;
          $ctx.finallyFallThrough = -2;
          break;
        case 37:
          $ctx.popTry();
          $ctx.state = 41;
          break;
        case 41:
          $ctx.state = 33;
          return fs.closeAsync(file);
        case 33:
          $ctx.maybeThrow();
          $ctx.state = 35;
          break;
        case 35:
          $ctx.state = $ctx.finallyFallThrough;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}));
var mnist = {setup: async($traceurRuntime.initGeneratorFunction(function $__12(af, expandLabels, frac) {
    var dataRoot,
        AFArray,
        Dim4,
        imageData,
        labelData,
        rIDims,
        images,
        r,
        cond,
        trainIndices,
        testIndices,
        trainImages,
        testImages,
        numClasses,
        numTrain,
        numTest,
        trainLabels,
        testLabels,
        hTrainIdx,
        hTestIdx,
        i,
        idx,
        label,
        i$__2,
        idx$__3,
        label$__4,
        labels;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            frac = Math.min(frac || 1.0, 0.8);
            dataRoot = "../../ml_lab/data/mnist";
            AFArray = af.AFArray;
            Dim4 = af.Dim4;
            $ctx.state = 35;
            break;
          case 35:
            $ctx.state = 2;
            return readIdx(path.join(dataRoot, "images-subset"), float);
          case 2:
            imageData = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return readIdx(path.join(dataRoot, "labels-subset"), uint);
          case 6:
            labelData = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            rIDims = new Dim4(_(imageData.dims).reverse().value());
            $ctx.state = 37;
            break;
          case 37:
            $ctx.state = 10;
            return AFArray.createAsync(rIDims, af.dType.f32, imageData.data);
          case 10:
            images = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            r = af.randu(10000, af.dType.f32);
            cond = r.lt(frac);
            trainIndices = af.where(cond);
            testIndices = af.where(cond.not());
            trainImages = af.lookup(images, trainIndices, 2).div(255);
            testImages = af.lookup(images, testIndices, 2).div(255);
            numClasses = 10;
            numTrain = trainImages.dims(2);
            numTest = testImages.dims(2);
            debug(("Training sample count: " + numTrain));
            debug(("Test sample count: " + numTest));
            $ctx.state = 39;
            break;
          case 39:
            $ctx.state = (expandLabels) ? 21 : 25;
            break;
          case 21:
            trainLabels = af.constant(0, numClasses, numTrain, af.dType.f32);
            testLabels = af.constant(0, numClasses, numTest, af.dType.f32);
            assert(trainIndices.type() === af.dType.u32);
            assert(testIndices.type() === af.dType.u32);
            $ctx.state = 22;
            break;
          case 22:
            $ctx.state = 14;
            return trainIndices.hostAsync();
          case 14:
            hTrainIdx = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return testIndices.hostAsync();
          case 18:
            hTestIdx = $ctx.sent;
            $ctx.state = 20;
            break;
          case 20:
            for (i = 0; i < numTrain; i++) {
              idx = uint.get(hTrainIdx, i * uint.size);
              label = uint.get(labelData.data, idx * uint.size);
              assert(label >= 0 && label <= 9);
              trainLabels.set(label, i, 1);
            }
            for (i$__2 = 0; i$__2 < numTest; i$__2++) {
              idx$__3 = uint.get(hTestIdx, i$__2 * uint.size);
              label$__4 = uint.get(labelData.data, idx$__3 * uint.size);
              assert(label$__4 >= 0 && label$__4 <= 9);
              testLabels.set(label$__4, i$__2, 1);
            }
            $ctx.state = 24;
            break;
          case 25:
            $ctx.state = 26;
            return AFArray.createAsync(labelData.dims[0], af.dType.u32, labelData.data);
          case 26:
            labels = $ctx.sent;
            $ctx.state = 28;
            break;
          case 28:
            trainLabels = labels.at(trainIndices);
            testLabels = labels.at(testIndices);
            $ctx.state = 24;
            break;
          case 24:
            $ctx.returnValue = {
              numClasses: numClasses,
              numTrain: numTrain,
              numTest: numTest,
              trainImages: trainImages,
              testImages: testImages,
              trainLabels: trainLabels,
              testLabels: testLabels
            };
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__12, this);
  }))};
module.exports = mnist;

//# sourceMappingURL=mnist.js.map
