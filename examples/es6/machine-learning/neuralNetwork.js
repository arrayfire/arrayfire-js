"use strict";

let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let common = require("../common");
let mnist = require("./mnist");
let ANN = require("./ann");
let now = require("performance-now");

let accuracy = async(function*(af, predicted, target) {
    let pMax = yield af.findMaxAtAsync(predicted, 1);
    let tMax = yield af.findMaxAtAsync(target, 1);
    return (100 * (yield af.countAsync(pMax.index.eq(tMax.index)))) / tMax.index.elements();
});

let annDemo = async(function*(af, deviceInfo) {
    console.log("Running ANN Demo on device:\n");
    common.printDeviceInfo(deviceInfo);
    console.log("");

    console.log("Setting up training data.");
    let data = yield mnist.setup(af, true, 0.6);

    let featureSize = data.trainImages.elements() / data.numTrain;

    // Reshape images into feature vectors
    let trainFeats = af.transpose(af.modDims(data.trainImages, featureSize, data.numTrain));
    let testFeats = af.transpose(af.modDims(data.testImages, featureSize, data.numTest));

    let trainTarget = af.transpose(data.trainLabels);
    let testTarget = af.transpose(data.testLabels);

    let network = new ANN(af, [trainFeats.dims(1), 100, 50, data.numClasses]);

    // Train network
    const start = now();
    yield network.train(
        trainFeats,
        trainTarget,
        {
            alpha: 1.0,
            maxEpochs: 5000,
            batchSize: 100,
            maxError: 0.0001
        }
    );
    yield af.waitAsync();
    const end = now();

    // Run the trained network and test accuracy.
    let trainOutput = network.predict(trainFeats);
    let testOutput = network.predict(testFeats);

    console.log("Training set:");
    console.log(`Accuracy on training data: ${(yield accuracy(af, trainOutput, trainTarget)).toFixed(2)}`);

    console.log("Test set:");
    console.log(`Accuracy on testing  data: ${(yield accuracy(af, testOutput, testTarget)).toFixed(2)}`);

    console.log(`Training time: ${((end - start) / 1000).toFixed(10)} seconds\n`);
});

common.runOnBestDevice(annDemo, "ANN Demo");