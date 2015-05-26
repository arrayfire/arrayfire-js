"use strict";

let _ = require("lodash");

module.exports = function(deviceID) {
    let did = _.isString(deviceID) ? deviceID.trim().toLowerCase() : null;
    did = did || "cpu";
    switch(did) {
        case "cpu":
            return require("bindings")("arrayfire_js_CPU");
        case "cuda":
            return require("bindings")("arrayfire_js_CUDA");
        case "opencl":
            return require("bindings")("arrayfire_js_OpenCL");
        default:
            throw new Error("Device '" + deviceID + "' is not supported.");
    }
};
