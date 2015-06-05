/*
Copyright 2015 Gábor Mezõ aka unbornchikken

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict";

let _ = require("lodash");
let Ext = require("./ext");
let Bluebird = require("bluebird");

let entry = module.exports = function(id) {
    let did = _.isString(id) ? id.trim().toLowerCase() : null;
    did = did || "cpu";
    function createAF() {
        switch (did) {
            case "cpu":
                return require("bindings")("fire_js_CPU");
            case "cuda":
                return require("bindings")("fire_js_CUDA");
            case "opencl":
                return require("bindings")("fire_js_OpenCL");
            default:
                throw new Error("Platforms '" + id + "' is not supported.");
        }
    }
    let af = createAF();
    if (!af.__extended) {
        _.extend(af, new Ext(af));
        af.__extended = true;
    }
    return af;
};

entry.supportedPlatforms = function() {
    let platforms = [];
    for (let id of ["CPU", "CUDA", "OpenCL"]) {
        try {
            let fire = entry(id);
            platforms.push(id);
        }
        catch(e) {
        }
    }
    return platforms;
};