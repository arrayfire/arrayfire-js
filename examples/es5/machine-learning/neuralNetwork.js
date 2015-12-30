"use strict";

var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var common = require("../common");
var mnist = require("./mnist");
var ANN = require("./ann");
var now = require("performance-now");

var accuracy = function accuracy(af, predicted, target) {
    var pMax = af.findMaxAt(predicted, 1);
    var tMax = af.findMaxAt(target, 1);
    return 100 * af.count(pMax.index.eq(tMax.index)) / tMax.index.elements();
};

var annDemo = async(regeneratorRuntime.mark(function _callee(af, deviceInfo) {
    var data, featureSize, trainFeats, testFeats, trainTarget, testTarget, network, start, end, trainOutput, testOutput;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    console.log("Running ANN Demo on device:\n");
                    common.printDeviceInfo(deviceInfo);
                    console.log("");

                    console.log("Setting up training data.");
                    _context.next = 6;
                    return mnist.setup(af, true, 0.6);

                case 6:
                    data = _context.sent;
                    featureSize = data.trainImages.elements() / data.numTrain;

                    // Reshape images into feature vectors

                    trainFeats = af.transpose(af.modDims(data.trainImages, featureSize, data.numTrain));
                    testFeats = af.transpose(af.modDims(data.testImages, featureSize, data.numTest));
                    trainTarget = af.transpose(data.trainLabels);
                    testTarget = af.transpose(data.testLabels);
                    network = new ANN(af, [trainFeats.dims(1), 100, 50, data.numClasses]);

                    // Train network

                    start = now();

                    network.train(trainFeats, trainTarget, {
                        alpha: 1.0,
                        maxEpochs: 300,
                        batchSize: 100,
                        maxError: 0.0001
                    });
                    _context.next = 17;
                    return af.waitAsync();

                case 17:
                    end = now();

                    // Run the trained network and test accuracy.

                    trainOutput = network.predict(trainFeats);
                    testOutput = network.predict(testFeats);

                    console.log("Training set:");
                    console.log("Accuracy on training data: " + accuracy(af, trainOutput, trainTarget).toFixed(2));

                    console.log("Test set:");
                    console.log("Accuracy on testing  data: " + accuracy(af, testOutput, testTarget).toFixed(2));

                    console.log("Training time: " + ((end - start) / 1000).toFixed(10) + " seconds\n");

                case 25:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

common.runOnBestDevice(annDemo, "ANN Demo");
//# sourceMappingURL=neuralNetwork.js.map
