"use strict";
let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let asyncSupport = Bluebird.promisifyAll;
let fire = require("../../..");
let util = require("util");
var now = require("performance-now");

let runOnDevices = async(function*(platformID, f) {
    let fireOfToolkit = fire(platformID);
    for (let deviceInfo of fireOfToolkit.getDevices()) {
        const start = now();
        yield f(asyncSupport(fireOfToolkit), deviceInfo);
        const end = now();
        console.log(`\n-- took ${((end - start) / 1000).toFixed(10)} seconds\n`);
    }
});

let runOnAllPlatfroms = async(function*(f, name) {
    let platfroms = fire.supportedPlatforms();
    console.log(`Running ${name} on all supported platfroms: ${platfroms.join(", ")}\n`);
    try {
        for (let id of platfroms) {
            yield runOnDevices(id, f);
        }
    }
    catch(e) {
        console.error(e.stack);
    }
});

let printDeviceInfo = function(deviceInfo) {
    console.log(`ID: ${deviceInfo.id}\nName: ${deviceInfo.name}\nPlatform: ${deviceInfo.platform}\nToolkit: ${deviceInfo.toolkit}\nCompute: ${deviceInfo.compute}`);
};

module.exports = {
    runOnAllPlatfroms: runOnAllPlatfroms,
    printDeviceInfo: printDeviceInfo
};