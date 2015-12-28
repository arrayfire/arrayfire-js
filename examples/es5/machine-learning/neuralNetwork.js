"use strict";

var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var common = require("../common");
var mnist = require("./mnist");
var ANN = require("./ann");
var now = require("performance-now");

var accuracy = async(regeneratorRuntime.mark(function _callee(af, predicted, target) {
    var pMax, tMax;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return af.findMaxAtAsync(predicted, 1);

                case 2:
                    pMax = _context.sent;
                    _context.next = 5;
                    return af.findMaxAtAsync(target, 1);

                case 5:
                    tMax = _context.sent;
                    _context.next = 8;
                    return af.countAsync(pMax.index.eq(tMax.index));

                case 8:
                    _context.t0 = _context.sent;
                    _context.t1 = 100 * _context.t0;
                    _context.t2 = tMax.index.elements();
                    return _context.abrupt("return", _context.t1 / _context.t2);

                case 12:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

var annDemo = async(regeneratorRuntime.mark(function _callee2(af, deviceInfo) {
    var data, featureSize, trainFeats, testFeats, trainTarget, testTarget, network, start, end, trainOutput, testOutput;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    console.log("Running ANN Demo on device:\n");
                    common.printDeviceInfo(deviceInfo);
                    console.log("");

                    console.log("Setting up training data.");
                    _context2.next = 6;
                    return mnist.setup(af, true, 0.6);

                case 6:
                    data = _context2.sent;
                    featureSize = data.trainImages.elements() / data.numTrain;

                    // Reshape images into feature vectors

                    trainFeats = af.transpose(af.modDims(data.trainImages, featureSize, data.numTrain));
                    testFeats = af.transpose(af.modDims(data.testImages, featureSize, data.numTest));
                    trainTarget = af.transpose(data.trainLabels);
                    testTarget = af.transpose(data.testLabels);
                    network = new ANN(af, [trainFeats.dims(1), 100, 50, data.numClasses]);

                    // Train network

                    start = now();
                    _context2.next = 16;
                    return network.train(trainFeats, trainTarget, {
                        alpha: 1.0,
                        maxEpochs: 300,
                        batchSize: 100,
                        maxError: 0.0001
                    });

                case 16:
                    _context2.next = 18;
                    return af.waitAsync();

                case 18:
                    end = now();

                    // Run the trained network and test accuracy.

                    trainOutput = network.predict(trainFeats);
                    testOutput = network.predict(testFeats);

                    console.log("Training set:");
                    _context2.t0 = console;
                    _context2.next = 25;
                    return accuracy(af, trainOutput, trainTarget);

                case 25:
                    _context2.t1 = _context2.sent.toFixed(2);
                    _context2.t2 = "Accuracy on training data: " + _context2.t1;

                    _context2.t0.log.call(_context2.t0, _context2.t2);

                    console.log("Test set:");
                    _context2.t3 = console;
                    _context2.next = 32;
                    return accuracy(af, testOutput, testTarget);

                case 32:
                    _context2.t4 = _context2.sent.toFixed(2);
                    _context2.t5 = "Accuracy on testing  data: " + _context2.t4;

                    _context2.t3.log.call(_context2.t3, _context2.t5);

                    console.log("Training time: " + ((end - start) / 1000).toFixed(10) + " seconds\n");

                case 36:
                case "end":
                    return _context2.stop();
            }
        }
    }, _callee2, this);
}));

common.runOnBestDevice(annDemo, "ANN Demo");
//# sourceMappingURL=neuralNetwork.js.map
