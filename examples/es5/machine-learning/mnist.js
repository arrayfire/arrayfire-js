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

var readData = async(regeneratorRuntime.mark(function _callee(f, data) {
    var bytesRead;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return fs.readAsync(f, data, 0, data.length, null);

                case 2:
                    bytesRead = _context.sent[0];

                    if (!(bytesRead !== data.length)) {
                        _context.next = 5;
                        break;
                    }

                    throw new Error("File reading error!");

                case 5:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

var readIdx = async(regeneratorRuntime.mark(function _callee2(path, type) {
    var file, d, numDims, elem, dims, i, dim, bdata, data, byte;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return fs.openAsync(path, "r");

                case 2:
                    file = _context2.sent;
                    _context2.prev = 3;
                    d = new Buffer(4);
                    _context2.next = 7;
                    return readData(file, d);

                case 7:
                    if (!(d[2] != 8)) {
                        _context2.next = 9;
                        break;
                    }

                    throw new Error("Unsupported data type");

                case 9:
                    numDims = d[3];

                    // Read the dimensions

                    elem = 1;
                    dims = [];
                    i = 0;

                case 13:
                    if (!(i < numDims)) {
                        _context2.next = 22;
                        break;
                    }

                    _context2.next = 16;
                    return readData(file, d);

                case 16:
                    dim = d.readUInt32BE();

                    elem *= dim;
                    dims.push(dim);

                case 19:
                    i++;
                    _context2.next = 13;
                    break;

                case 22:

                    // Read the data
                    bdata = new Buffer(elem);
                    _context2.next = 25;
                    return readData(file, bdata);

                case 25:
                    data = new Buffer(bdata.length * type.size);

                    for (i = 0; i < bdata.length; i++) {
                        byte = bdata[i];

                        type.set(data, i * type.size, byte);
                    }

                    return _context2.abrupt("return", {
                        numDims: numDims,
                        dims: dims,
                        data: data
                    });

                case 28:
                    _context2.prev = 28;
                    _context2.next = 31;
                    return fs.closeAsync(file);

                case 31:
                    return _context2.finish(28);

                case 32:
                case "end":
                    return _context2.stop();
            }
        }
    }, _callee2, this, [[3,, 28, 32]]);
}));

var mnist = {
    setup: async(regeneratorRuntime.mark(function _callee3(af, expandLabels, frac) {
        var dataRoot, AFArray, Dim4, imageData, labelData, rIDims, images, r, cond, trainIndices, testIndices, trainImages, testImages, numClasses, numTrain, numTest, trainLabels, testLabels, hTrainIdx, hTestIdx, _i, idx, label, _i2, labels;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        frac = Math.min(frac || 1.0, 0.8);
                        dataRoot = "../../ml_lab/data/mnist";
                        AFArray = af.AFArray;
                        Dim4 = af.Dim4;
                        _context3.next = 6;
                        return readIdx(path.join(dataRoot, "images-subset"), float);

                    case 6:
                        imageData = _context3.sent;
                        _context3.next = 9;
                        return readIdx(path.join(dataRoot, "labels-subset"), uint);

                    case 9:
                        labelData = _context3.sent;
                        rIDims = new Dim4(_(imageData.dims).reverse().value());
                        _context3.next = 13;
                        return AFArray.createAsync(rIDims, af.dType.f32, imageData.data);

                    case 13:
                        images = _context3.sent;
                        r = af.randu(10000, af.dType.f32);
                        cond = r.lt(frac);
                        trainIndices = af.where(cond);
                        testIndices = af.where(cond.not());
                        trainImages = af.lookup(images, trainIndices, 2).div(255);
                        testImages = af.lookup(images, testIndices, 2).div(255);
                        numClasses = 10;
                        numTrain = trainImages.dims(2);
                        numTest = testImages.dims(2);

                        debug("Training sample count: " + numTrain);
                        debug("Test sample count: " + numTest);

                        trainLabels = undefined;
                        testLabels = undefined;

                        if (!expandLabels) {
                            _context3.next = 42;
                            break;
                        }

                        trainLabels = af.constant(0, numClasses, numTrain, af.dType.f32);
                        testLabels = af.constant(0, numClasses, numTest, af.dType.f32);

                        assert(trainIndices.type() === af.dType.u32);
                        assert(testIndices.type() === af.dType.u32);

                        _context3.next = 34;
                        return trainIndices.hostAsync();

                    case 34:
                        hTrainIdx = _context3.sent;
                        _context3.next = 37;
                        return testIndices.hostAsync();

                    case 37:
                        hTestIdx = _context3.sent;

                        for (_i = 0; _i < numTrain; _i++) {
                            idx = uint.get(hTrainIdx, _i * uint.size);
                            label = uint.get(labelData.data, idx * uint.size);

                            assert(label >= 0 && label <= 9);
                            trainLabels.set(label, _i, 1);
                        }

                        for (_i2 = 0; _i2 < numTest; _i2++) {
                            idx = uint.get(hTestIdx, _i2 * uint.size);
                            label = uint.get(labelData.data, idx * uint.size);

                            assert(label >= 0 && label <= 9);
                            testLabels.set(label, _i2, 1);
                        }
                        _context3.next = 47;
                        break;

                    case 42:
                        _context3.next = 44;
                        return AFArray.createAsync(labelData.dims[0], af.dType.u32, labelData.data);

                    case 44:
                        labels = _context3.sent;

                        trainLabels = labels.at(trainIndices);
                        testLabels = labels.at(testIndices);

                    case 47:
                        return _context3.abrupt("return", {
                            numClasses: numClasses,
                            numTrain: numTrain,
                            numTest: numTest,
                            trainImages: trainImages,
                            testImages: testImages,
                            trainLabels: trainLabels,
                            testLabels: testLabels
                        });

                    case 48:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }))
};

module.exports = mnist;
//# sourceMappingURL=mnist.js.map
