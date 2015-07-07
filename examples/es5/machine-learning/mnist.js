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
//# sourceMappingURL=data:application/json;base64,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S0FBSyxDQUFDO0FBQ3BELG1CQUFLLEFBQUMsQ0FBQyxZQUFTLEVBQUEsQ0FBQSxFQUFLLGFBQVMsRUFBQSxDQUFDLENBQUM7QUFDaEMsdUJBQVMsSUFBSSxBQUFDLGtCQUFXLEVBQUEsQ0FBQyxDQUFDO1lBQy9CO0FBQUE7Ozs7aUJBR21CLENBQUEsT0FBTSxZQUFZLEFBQUMsQ0FBQyxTQUFRLEtBQUssQ0FBRSxDQUFBLENBQUMsQ0FBRyxDQUFBLEVBQUMsTUFBTSxJQUFJLENBQUcsQ0FBQSxTQUFRLEtBQUssQ0FBQzs7bUJBdkhsRyxDQUFBLElBQUcsS0FBSzs7OztBQXdISSxzQkFBVSxFQUFJLENBQUEsTUFBSyxHQUFHLEFBQUMsQ0FBQyxZQUFXLENBQUMsQ0FBQztBQUNyQyxxQkFBUyxFQUFJLENBQUEsTUFBSyxHQUFHLEFBQUMsQ0FBQyxXQUFVLENBQUMsQ0FBQzs7OztBQXpIL0MsZUFBRyxZQUFZLEVBNEhBO0FBQ0gsdUJBQVMsQ0FBRyxXQUFTO0FBQ3JCLHFCQUFPLENBQUcsU0FBTztBQUNqQixvQkFBTSxDQUFHLFFBQU07QUFDZix3QkFBVSxDQUFHLFlBQVU7QUFDdkIsdUJBQVMsQ0FBRyxXQUFTO0FBQ3JCLHdCQUFVLENBQUcsWUFBVTtBQUN2Qix1QkFBUyxDQUFHLFdBQVM7QUFBQSxZQUN6QixBQXBJMkIsQ0FBQTs7OztBQUFuQyxpQkFBTyxDQUFBLElBQUcsSUFBSSxBQUFDLEVBQUMsQ0FBQTs7QUFDbUIsSUFDL0IsUUFBNkIsS0FBRyxDQUFDLENBQUM7RUFtSWxDLENBckltRCxDQXFJbEQsQ0FDTCxDQUFDO0FBRUQsS0FBSyxRQUFRLEVBQUksTUFBSSxDQUFDO0FBQUEiLCJmaWxlIjoibWFjaGluZS1sZWFybmluZy9tbmlzdC5qcyIsInNvdXJjZVJvb3QiOiJleGFtcGxlcy9lczYiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxubGV0IEJsdWViaXJkID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xubGV0IGFzeW5jID0gQmx1ZWJpcmQuY29yb3V0aW5lO1xubGV0IGZzID0gQmx1ZWJpcmQucHJvbWlzaWZ5QWxsKHJlcXVpcmUoXCJmcy1leHRyYVwiKSk7XG5sZXQgcmVmID0gcmVxdWlyZShcInJlZlwiKTtcbmxldCBmbG9hdCA9IHJlZi50eXBlcy5mbG9hdDtcbmxldCB1aW50ID0gcmVmLnR5cGVzLnVpbnQ7XG5sZXQgZGVidWcgPSByZXF1aXJlKFwiZGVidWdcIikoXCJhZjptbmlzdFwiKTtcbmxldCBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcbmxldCBhc3NlcnQgPSByZXF1aXJlKFwiYmV0dGVyLWFzc2VydFwiKTtcbmxldCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5cbmxldCByZWFkRGF0YSA9IGFzeW5jKGZ1bmN0aW9uKihmLCBkYXRhKSB7XG4gICAgbGV0IGJ5dGVzUmVhZCA9ICh5aWVsZCBmcy5yZWFkQXN5bmMoZiwgZGF0YSwgMCwgZGF0YS5sZW5ndGgsIG51bGwpKVswXTtcbiAgICBpZiAoYnl0ZXNSZWFkICE9PSBkYXRhLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGaWxlIHJlYWRpbmcgZXJyb3IhXCIpO1xuICAgIH1cbn0pO1xuXG5sZXQgcmVhZElkeCA9IGFzeW5jKGZ1bmN0aW9uKihwYXRoLCB0eXBlKSB7XG4gICAgbGV0IGZpbGUgPSB5aWVsZCBmcy5vcGVuQXN5bmMocGF0aCwgXCJyXCIpO1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBkID0gbmV3IEJ1ZmZlcig0KTtcblxuICAgICAgICB5aWVsZCByZWFkRGF0YShmaWxlLCBkKTtcblxuICAgICAgICBpZiAoZFsyXSAhPSA4KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBkYXRhIHR5cGVcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBudW1EaW1zID0gZFszXTtcblxuICAgICAgICAvLyBSZWFkIHRoZSBkaW1lbnNpb25zXG4gICAgICAgIGxldCBlbGVtID0gMTtcbiAgICAgICAgbGV0IGRpbXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EaW1zOyBpKyspIHtcbiAgICAgICAgICAgIHlpZWxkIHJlYWREYXRhKGZpbGUsIGQpO1xuICAgICAgICAgICAgbGV0IGRpbSA9IGQucmVhZFVJbnQzMkJFKCk7XG4gICAgICAgICAgICBlbGVtICo9IGRpbTtcbiAgICAgICAgICAgIGRpbXMucHVzaChkaW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVhZCB0aGUgZGF0YVxuICAgICAgICBsZXQgYmRhdGEgPSBuZXcgQnVmZmVyKGVsZW0pO1xuICAgICAgICB5aWVsZCByZWFkRGF0YShmaWxlLCBiZGF0YSk7XG4gICAgICAgIGxldCBkYXRhID0gbmV3IEJ1ZmZlcihiZGF0YS5sZW5ndGggKiB0eXBlLnNpemUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnl0ZSA9IGJkYXRhW2ldO1xuICAgICAgICAgICAgdHlwZS5zZXQoZGF0YSwgaSAqIHR5cGUuc2l6ZSwgYnl0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbnVtRGltczogbnVtRGltcyxcbiAgICAgICAgICAgIGRpbXM6IGRpbXMsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB5aWVsZCBmcy5jbG9zZUFzeW5jKGZpbGUpO1xuICAgIH1cbn0pO1xuXG5sZXQgbW5pc3QgPSB7XG4gICAgc2V0dXA6IGFzeW5jKGZ1bmN0aW9uKihhZiwgZXhwYW5kTGFiZWxzLCBmcmFjKSB7XG4gICAgICAgIGZyYWMgPSBNYXRoLm1pbihmcmFjIHx8IDEuMCwgMC44KTtcbiAgICAgICAgbGV0IGRhdGFSb290ID0gXCIuLi8uLi9tbF9sYWIvZGF0YS9tbmlzdFwiO1xuICAgICAgICBsZXQgQUZBcnJheSA9IGFmLkFGQXJyYXk7XG4gICAgICAgIGxldCBEaW00ID0gYWYuRGltNDtcblxuICAgICAgICBsZXQgaW1hZ2VEYXRhID0geWllbGQgcmVhZElkeChwYXRoLmpvaW4oZGF0YVJvb3QsIFwiaW1hZ2VzLXN1YnNldFwiKSwgZmxvYXQpO1xuICAgICAgICBsZXQgbGFiZWxEYXRhID0geWllbGQgcmVhZElkeChwYXRoLmpvaW4oZGF0YVJvb3QsIFwibGFiZWxzLXN1YnNldFwiKSwgdWludCk7XG5cbiAgICAgICAgbGV0IHJJRGltcyA9IG5ldyBEaW00KF8oaW1hZ2VEYXRhLmRpbXMpLnJldmVyc2UoKS52YWx1ZSgpKTtcbiAgICAgICAgbGV0IGltYWdlcyA9IHlpZWxkIEFGQXJyYXkuY3JlYXRlQXN5bmMocklEaW1zLCBhZi5kVHlwZS5mMzIsIGltYWdlRGF0YS5kYXRhKTtcblxuICAgICAgICBsZXQgciA9IGFmLnJhbmR1KDEwMDAwLCBhZi5kVHlwZS5mMzIpO1xuICAgICAgICBsZXQgY29uZCA9IHIubHQoZnJhYyk7XG4gICAgICAgIGxldCB0cmFpbkluZGljZXMgPSBhZi53aGVyZShjb25kKTtcbiAgICAgICAgbGV0IHRlc3RJbmRpY2VzID0gYWYud2hlcmUoY29uZC5ub3QoKSk7XG5cbiAgICAgICAgbGV0IHRyYWluSW1hZ2VzID0gYWYubG9va3VwKGltYWdlcywgdHJhaW5JbmRpY2VzLCAyKS5kaXYoMjU1KTtcbiAgICAgICAgbGV0IHRlc3RJbWFnZXMgPSBhZi5sb29rdXAoaW1hZ2VzLCB0ZXN0SW5kaWNlcywgMikuZGl2KDI1NSk7XG5cbiAgICAgICAgbGV0IG51bUNsYXNzZXMgPSAxMDtcbiAgICAgICAgbGV0IG51bVRyYWluID0gdHJhaW5JbWFnZXMuZGltcygyKTtcbiAgICAgICAgbGV0IG51bVRlc3QgPSB0ZXN0SW1hZ2VzLmRpbXMoMik7XG5cbiAgICAgICAgZGVidWcoYFRyYWluaW5nIHNhbXBsZSBjb3VudDogJHtudW1UcmFpbn1gKTtcbiAgICAgICAgZGVidWcoYFRlc3Qgc2FtcGxlIGNvdW50OiAke251bVRlc3R9YCk7XG5cbiAgICAgICAgbGV0IHRyYWluTGFiZWxzO1xuICAgICAgICBsZXQgdGVzdExhYmVscztcblxuICAgICAgICBpZiAoZXhwYW5kTGFiZWxzKSB7XG4gICAgICAgICAgICB0cmFpbkxhYmVscyA9IGFmLmNvbnN0YW50KDAsIG51bUNsYXNzZXMsIG51bVRyYWluLCBhZi5kVHlwZS5mMzIpO1xuICAgICAgICAgICAgdGVzdExhYmVscyA9IGFmLmNvbnN0YW50KDAsIG51bUNsYXNzZXMsIG51bVRlc3QsIGFmLmRUeXBlLmYzMik7XG5cbiAgICAgICAgICAgIGFzc2VydCh0cmFpbkluZGljZXMudHlwZSgpID09PSBhZi5kVHlwZS51MzIpO1xuICAgICAgICAgICAgYXNzZXJ0KHRlc3RJbmRpY2VzLnR5cGUoKSA9PT0gYWYuZFR5cGUudTMyKTtcblxuICAgICAgICAgICAgbGV0IGhUcmFpbklkeCA9IHlpZWxkIHRyYWluSW5kaWNlcy5ob3N0QXN5bmMoKTtcbiAgICAgICAgICAgIGxldCBoVGVzdElkeCA9IHlpZWxkIHRlc3RJbmRpY2VzLmhvc3RBc3luYygpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRyYWluOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgaWR4ID0gdWludC5nZXQoaFRyYWluSWR4LCBpICogdWludC5zaXplKTtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSB1aW50LmdldChsYWJlbERhdGEuZGF0YSwgaWR4ICogdWludC5zaXplKTtcbiAgICAgICAgICAgICAgICBhc3NlcnQobGFiZWwgPj0gMCAmJiBsYWJlbCA8PSA5KTtcbiAgICAgICAgICAgICAgICB0cmFpbkxhYmVscy5zZXQobGFiZWwsIGksIDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVRlc3Q7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpZHggPSB1aW50LmdldChoVGVzdElkeCwgaSAqIHVpbnQuc2l6ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gdWludC5nZXQobGFiZWxEYXRhLmRhdGEsIGlkeCAqIHVpbnQuc2l6ZSk7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KGxhYmVsID49IDAgJiYgbGFiZWwgPD0gOSk7XG4gICAgICAgICAgICAgICAgdGVzdExhYmVscy5zZXQobGFiZWwsIGksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGxhYmVscyA9IHlpZWxkIEFGQXJyYXkuY3JlYXRlQXN5bmMobGFiZWxEYXRhLmRpbXNbMF0sIGFmLmRUeXBlLnUzMiwgbGFiZWxEYXRhLmRhdGEpO1xuICAgICAgICAgICAgdHJhaW5MYWJlbHMgPSBsYWJlbHMuYXQodHJhaW5JbmRpY2VzKTtcbiAgICAgICAgICAgIHRlc3RMYWJlbHMgPSBsYWJlbHMuYXQodGVzdEluZGljZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG51bUNsYXNzZXM6IG51bUNsYXNzZXMsXG4gICAgICAgICAgICBudW1UcmFpbjogbnVtVHJhaW4sXG4gICAgICAgICAgICBudW1UZXN0OiBudW1UZXN0LFxuICAgICAgICAgICAgdHJhaW5JbWFnZXM6IHRyYWluSW1hZ2VzLFxuICAgICAgICAgICAgdGVzdEltYWdlczogdGVzdEltYWdlcyxcbiAgICAgICAgICAgIHRyYWluTGFiZWxzOiB0cmFpbkxhYmVscyxcbiAgICAgICAgICAgIHRlc3RMYWJlbHM6IHRlc3RMYWJlbHNcbiAgICAgICAgfTtcbiAgICB9KVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtbmlzdDsiXX0=
