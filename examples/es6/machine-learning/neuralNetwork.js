"use strict";

let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let common = require("../common");
let mnist = require("./mnist");

let annDemo = async(function*(af, deviceInfo) {
    console.log("Running ANN Demo on device:\n");
    common.printDeviceInfo(deviceInfo);
    console.log("");

    console.log("Setting up training data.");
    let data = yield mnist.setup(af, true, 0.6);
});

common.runOnBestDevice(annDemo, "ANN Demo");