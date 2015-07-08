"use strict";
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
var readData = async($traceurRuntime.initGeneratorFunction(function $__4(f, data) {
  var bytesRead,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $__5 = fs.readAsync;
          $__6 = data.length;
          $__7 = $__5.call(fs, f, data, 0, $__6, null);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__7;
        case 2:
          $__8 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__9 = $__8[0];
          bytesRead = $__9;
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
  }, $__4, this);
}));
var readIdx = async($traceurRuntime.initGeneratorFunction(function $__10(path, type) {
  var file,
      d,
      numDims,
      elem,
      dims,
      i,
      dim,
      bdata,
      data,
      i$__0,
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
          for (i$__0 = 0; i$__0 < bdata.length; i$__0++) {
            byte = bdata[i$__0];
            type.set(data, i$__0 * type.size, byte);
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
  }, $__10, this);
}));
var mnist = {setup: async($traceurRuntime.initGeneratorFunction(function $__11(af, expandLabels, frac) {
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
        i$__1,
        idx$__2,
        label$__3,
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
            for (i$__1 = 0; i$__1 < numTest; i$__1++) {
              idx$__2 = uint.get(hTestIdx, i$__1 * uint.size);
              label$__3 = uint.get(labelData.data, idx$__2 * uint.size);
              assert(label$__3 >= 0 && label$__3 <= 9);
              testLabels.set(label$__3, i$__1, 1);
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
    }, $__11, this);
  }))};
module.exports = mnist;
//# sourceMappingURL=data:application/json;base64,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bW5pc3QuanMiLCJzb3VyY2VSb290IjoiZXhhbXBsZXMvZXM2Iiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmxldCBCbHVlYmlyZCA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbmxldCBhc3luYyA9IEJsdWViaXJkLmNvcm91dGluZTtcbmxldCBmcyA9IEJsdWViaXJkLnByb21pc2lmeUFsbChyZXF1aXJlKFwiZnMtZXh0cmFcIikpO1xubGV0IHJlZiA9IHJlcXVpcmUoXCJyZWZcIik7XG5sZXQgZmxvYXQgPSByZWYudHlwZXMuZmxvYXQ7XG5sZXQgdWludCA9IHJlZi50eXBlcy51aW50O1xubGV0IGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwiYWY6bW5pc3RcIik7XG5sZXQgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XG5sZXQgYXNzZXJ0ID0gcmVxdWlyZShcImJldHRlci1hc3NlcnRcIik7XG5sZXQgcGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5sZXQgcmVhZERhdGEgPSBhc3luYyhmdW5jdGlvbiooZiwgZGF0YSkge1xuICAgIGxldCBieXRlc1JlYWQgPSAoeWllbGQgZnMucmVhZEFzeW5jKGYsIGRhdGEsIDAsIGRhdGEubGVuZ3RoLCBudWxsKSlbMF07XG4gICAgaWYgKGJ5dGVzUmVhZCAhPT0gZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmlsZSByZWFkaW5nIGVycm9yIVwiKTtcbiAgICB9XG59KTtcblxubGV0IHJlYWRJZHggPSBhc3luYyhmdW5jdGlvbioocGF0aCwgdHlwZSkge1xuICAgIGxldCBmaWxlID0geWllbGQgZnMub3BlbkFzeW5jKHBhdGgsIFwiclwiKTtcbiAgICB0cnkge1xuICAgICAgICBsZXQgZCA9IG5ldyBCdWZmZXIoNCk7XG5cbiAgICAgICAgeWllbGQgcmVhZERhdGEoZmlsZSwgZCk7XG5cbiAgICAgICAgaWYgKGRbMl0gIT0gOCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgZGF0YSB0eXBlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbnVtRGltcyA9IGRbM107XG5cbiAgICAgICAgLy8gUmVhZCB0aGUgZGltZW5zaW9uc1xuICAgICAgICBsZXQgZWxlbSA9IDE7XG4gICAgICAgIGxldCBkaW1zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGltczsgaSsrKSB7XG4gICAgICAgICAgICB5aWVsZCByZWFkRGF0YShmaWxlLCBkKTtcbiAgICAgICAgICAgIGxldCBkaW0gPSBkLnJlYWRVSW50MzJCRSgpO1xuICAgICAgICAgICAgZWxlbSAqPSBkaW07XG4gICAgICAgICAgICBkaW1zLnB1c2goZGltKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlYWQgdGhlIGRhdGFcbiAgICAgICAgbGV0IGJkYXRhID0gbmV3IEJ1ZmZlcihlbGVtKTtcbiAgICAgICAgeWllbGQgcmVhZERhdGEoZmlsZSwgYmRhdGEpO1xuICAgICAgICBsZXQgZGF0YSA9IG5ldyBCdWZmZXIoYmRhdGEubGVuZ3RoICogdHlwZS5zaXplKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ5dGUgPSBiZGF0YVtpXTtcbiAgICAgICAgICAgIHR5cGUuc2V0KGRhdGEsIGkgKiB0eXBlLnNpemUsIGJ5dGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG51bURpbXM6IG51bURpbXMsXG4gICAgICAgICAgICBkaW1zOiBkaW1zLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9O1xuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgeWllbGQgZnMuY2xvc2VBc3luYyhmaWxlKTtcbiAgICB9XG59KTtcblxubGV0IG1uaXN0ID0ge1xuICAgIHNldHVwOiBhc3luYyhmdW5jdGlvbiooYWYsIGV4cGFuZExhYmVscywgZnJhYykge1xuICAgICAgICBmcmFjID0gTWF0aC5taW4oZnJhYyB8fCAxLjAsIDAuOCk7XG4gICAgICAgIGxldCBkYXRhUm9vdCA9IFwiLi4vLi4vbWxfbGFiL2RhdGEvbW5pc3RcIjtcbiAgICAgICAgbGV0IEFGQXJyYXkgPSBhZi5BRkFycmF5O1xuICAgICAgICBsZXQgRGltNCA9IGFmLkRpbTQ7XG5cbiAgICAgICAgbGV0IGltYWdlRGF0YSA9IHlpZWxkIHJlYWRJZHgocGF0aC5qb2luKGRhdGFSb290LCBcImltYWdlcy1zdWJzZXRcIiksIGZsb2F0KTtcbiAgICAgICAgbGV0IGxhYmVsRGF0YSA9IHlpZWxkIHJlYWRJZHgocGF0aC5qb2luKGRhdGFSb290LCBcImxhYmVscy1zdWJzZXRcIiksIHVpbnQpO1xuXG4gICAgICAgIGxldCBySURpbXMgPSBuZXcgRGltNChfKGltYWdlRGF0YS5kaW1zKS5yZXZlcnNlKCkudmFsdWUoKSk7XG4gICAgICAgIGxldCBpbWFnZXMgPSB5aWVsZCBBRkFycmF5LmNyZWF0ZUFzeW5jKHJJRGltcywgYWYuZFR5cGUuZjMyLCBpbWFnZURhdGEuZGF0YSk7XG5cbiAgICAgICAgbGV0IHIgPSBhZi5yYW5kdSgxMDAwMCwgYWYuZFR5cGUuZjMyKTtcbiAgICAgICAgbGV0IGNvbmQgPSByLmx0KGZyYWMpO1xuICAgICAgICBsZXQgdHJhaW5JbmRpY2VzID0gYWYud2hlcmUoY29uZCk7XG4gICAgICAgIGxldCB0ZXN0SW5kaWNlcyA9IGFmLndoZXJlKGNvbmQubm90KCkpO1xuXG4gICAgICAgIGxldCB0cmFpbkltYWdlcyA9IGFmLmxvb2t1cChpbWFnZXMsIHRyYWluSW5kaWNlcywgMikuZGl2KDI1NSk7XG4gICAgICAgIGxldCB0ZXN0SW1hZ2VzID0gYWYubG9va3VwKGltYWdlcywgdGVzdEluZGljZXMsIDIpLmRpdigyNTUpO1xuXG4gICAgICAgIGxldCBudW1DbGFzc2VzID0gMTA7XG4gICAgICAgIGxldCBudW1UcmFpbiA9IHRyYWluSW1hZ2VzLmRpbXMoMik7XG4gICAgICAgIGxldCBudW1UZXN0ID0gdGVzdEltYWdlcy5kaW1zKDIpO1xuXG4gICAgICAgIGRlYnVnKGBUcmFpbmluZyBzYW1wbGUgY291bnQ6ICR7bnVtVHJhaW59YCk7XG4gICAgICAgIGRlYnVnKGBUZXN0IHNhbXBsZSBjb3VudDogJHtudW1UZXN0fWApO1xuXG4gICAgICAgIGxldCB0cmFpbkxhYmVscztcbiAgICAgICAgbGV0IHRlc3RMYWJlbHM7XG5cbiAgICAgICAgaWYgKGV4cGFuZExhYmVscykge1xuICAgICAgICAgICAgdHJhaW5MYWJlbHMgPSBhZi5jb25zdGFudCgwLCBudW1DbGFzc2VzLCBudW1UcmFpbiwgYWYuZFR5cGUuZjMyKTtcbiAgICAgICAgICAgIHRlc3RMYWJlbHMgPSBhZi5jb25zdGFudCgwLCBudW1DbGFzc2VzLCBudW1UZXN0LCBhZi5kVHlwZS5mMzIpO1xuXG4gICAgICAgICAgICBhc3NlcnQodHJhaW5JbmRpY2VzLnR5cGUoKSA9PT0gYWYuZFR5cGUudTMyKTtcbiAgICAgICAgICAgIGFzc2VydCh0ZXN0SW5kaWNlcy50eXBlKCkgPT09IGFmLmRUeXBlLnUzMik7XG5cbiAgICAgICAgICAgIGxldCBoVHJhaW5JZHggPSB5aWVsZCB0cmFpbkluZGljZXMuaG9zdEFzeW5jKCk7XG4gICAgICAgICAgICBsZXQgaFRlc3RJZHggPSB5aWVsZCB0ZXN0SW5kaWNlcy5ob3N0QXN5bmMoKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UcmFpbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkeCA9IHVpbnQuZ2V0KGhUcmFpbklkeCwgaSAqIHVpbnQuc2l6ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gdWludC5nZXQobGFiZWxEYXRhLmRhdGEsIGlkeCAqIHVpbnQuc2l6ZSk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KGxhYmVsID49IDAgJiYgbGFiZWwgPD0gOSk7XG4gICAgICAgICAgICAgICAgdHJhaW5MYWJlbHMuc2V0KGxhYmVsLCBpLCAxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1UZXN0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdWludC5nZXQoaFRlc3RJZHgsIGkgKiB1aW50LnNpemUpO1xuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IHVpbnQuZ2V0KGxhYmVsRGF0YS5kYXRhLCBpZHggKiB1aW50LnNpemUpO1xuICAgICAgICAgICAgICAgIGFzc2VydChsYWJlbCA+PSAwICYmIGxhYmVsIDw9IDkpO1xuICAgICAgICAgICAgICAgIHRlc3RMYWJlbHMuc2V0KGxhYmVsLCBpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBsYWJlbHMgPSB5aWVsZCBBRkFycmF5LmNyZWF0ZUFzeW5jKGxhYmVsRGF0YS5kaW1zWzBdLCBhZi5kVHlwZS51MzIsIGxhYmVsRGF0YS5kYXRhKTtcbiAgICAgICAgICAgIHRyYWluTGFiZWxzID0gbGFiZWxzLmF0KHRyYWluSW5kaWNlcyk7XG4gICAgICAgICAgICB0ZXN0TGFiZWxzID0gbGFiZWxzLmF0KHRlc3RJbmRpY2VzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBudW1DbGFzc2VzOiBudW1DbGFzc2VzLFxuICAgICAgICAgICAgbnVtVHJhaW46IG51bVRyYWluLFxuICAgICAgICAgICAgbnVtVGVzdDogbnVtVGVzdCxcbiAgICAgICAgICAgIHRyYWluSW1hZ2VzOiB0cmFpbkltYWdlcyxcbiAgICAgICAgICAgIHRlc3RJbWFnZXM6IHRlc3RJbWFnZXMsXG4gICAgICAgICAgICB0cmFpbkxhYmVsczogdHJhaW5MYWJlbHMsXG4gICAgICAgICAgICB0ZXN0TGFiZWxzOiB0ZXN0TGFiZWxzXG4gICAgICAgIH07XG4gICAgfSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbW5pc3Q7Il19
