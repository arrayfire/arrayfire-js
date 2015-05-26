"use strict";

let _ = require("lodash");
let Ext = require("./ext");
let Bluebird = require("bluebird");

module.exports = function(platform) {
    let did = _.isString(platform) ? platform.trim().toLowerCase() : null;
    did = did || "cpu";
    function createAF() {
        switch (did) {
            case "cpu":
                return require("bindings")("arrayfire_js_CPU");
            case "cuda":
                return require("bindings")("arrayfire_js_CUDA");
            case "opencl":
                return require("bindings")("arrayfire_js_OpenCL");
            default:
                throw new Error("Device '" + platform + "' is not supported.");
        }
    }
    let af = createAF();
    _.extend(af, new Ext(af));
    return Bluebird.promisifyAll(af);
};
