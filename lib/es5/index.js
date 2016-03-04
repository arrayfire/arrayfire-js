/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

 * Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict";

var _ = require("lodash");
var ext = require("./ext");
var Bluebird = require("bluebird");
var debug = require("debug")("af");

var cpuDriver = null;
var cudaDriver = null;
var openCLDriver = null;

var entry = module.exports = function (id) {
    var did = _.isString(id) ? id.trim().toLowerCase() : null;
    did = did || "cpu";
    function createAF() {
        switch (did) {
            case "cpu":
                return cpuDriver || (cpuDriver = require("bindings")("arrayfire_js_CPU"));
            case "cuda":
                return cudaDriver || (cudaDriver = require("bindings")("arrayfire_js_CUDA"));
            case "opencl":
                return openCLDriver || (openCLDriver = require("bindings")("arrayfire_js_OpenCL"));
            default:
                throw new Error("Platform '" + id + "' is not supported.");
        }
    }
    var af = createAF();
    if (!af.__extended) {
        ext(af);
        af.__extended = true;
    }
    return af;
};

entry.supportedPlatforms = function () {
    var platforms = [];
    var _arr = ["CPU", "CUDA", "OpenCL"];
    for (var _i = 0; _i < _arr.length; _i++) {
        var id = _arr[_i];
        try {
            var fire = entry(id);
            platforms.push(id);
        } catch (e) {
            debug("Cannot create ArrayFire binding of platform %s, because of error:\n%s", id, e.stack);
        }
    }
    return platforms;
};
//# sourceMappingURL=index.js.map
