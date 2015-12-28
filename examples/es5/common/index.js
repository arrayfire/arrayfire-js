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

var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var af = require("../../..");
var util = require("util");
var now = require("performance-now");
var _ = require("lodash");

var runOnDevices = async(regeneratorRuntime.mark(function _callee(platformID, f, onID) {
    var afOfPlatform, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, deviceInfo, start, end;

    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    afOfPlatform = af(platformID);
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 4;
                    _iterator = afOfPlatform.getDevices()[Symbol.iterator]();

                case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context.next = 18;
                        break;
                    }

                    deviceInfo = _step.value;

                    if (!(_.isUndefined(onID) || onID === deviceInfo.id)) {
                        _context.next = 15;
                        break;
                    }

                    afOfPlatform.setDevice(deviceInfo.id);
                    start = now();
                    _context.next = 13;
                    return f(afOfPlatform, deviceInfo);

                case 13:
                    end = now();

                    console.log("\n-- took " + ((end - start) / 1000).toFixed(10) + " seconds\n");

                case 15:
                    _iteratorNormalCompletion = true;
                    _context.next = 6;
                    break;

                case 18:
                    _context.next = 24;
                    break;

                case 20:
                    _context.prev = 20;
                    _context.t0 = _context["catch"](4);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                case 24:
                    _context.prev = 24;
                    _context.prev = 25;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }

                case 27:
                    _context.prev = 27;

                    if (!_didIteratorError) {
                        _context.next = 30;
                        break;
                    }

                    throw _iteratorError;

                case 30:
                    return _context.finish(27);

                case 31:
                    return _context.finish(24);

                case 32:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this, [[4, 20, 24, 32], [25,, 27, 31]]);
}));

var runOnAllPlatforms = async(regeneratorRuntime.mark(function _callee2(f, name) {
    var platfroms, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    platfroms = af.supportedPlatforms();

                    console.log("Running " + name + " on all supported platfroms: " + platfroms.join(", ") + "\n");
                    _context2.prev = 2;
                    _iteratorNormalCompletion2 = true;
                    _didIteratorError2 = false;
                    _iteratorError2 = undefined;
                    _context2.prev = 6;
                    _iterator2 = platfroms[Symbol.iterator]();

                case 8:
                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                        _context2.next = 15;
                        break;
                    }

                    id = _step2.value;
                    _context2.next = 12;
                    return runOnDevices(id, f);

                case 12:
                    _iteratorNormalCompletion2 = true;
                    _context2.next = 8;
                    break;

                case 15:
                    _context2.next = 21;
                    break;

                case 17:
                    _context2.prev = 17;
                    _context2.t0 = _context2["catch"](6);
                    _didIteratorError2 = true;
                    _iteratorError2 = _context2.t0;

                case 21:
                    _context2.prev = 21;
                    _context2.prev = 22;

                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }

                case 24:
                    _context2.prev = 24;

                    if (!_didIteratorError2) {
                        _context2.next = 27;
                        break;
                    }

                    throw _iteratorError2;

                case 27:
                    return _context2.finish(24);

                case 28:
                    return _context2.finish(21);

                case 29:
                    _context2.next = 34;
                    break;

                case 31:
                    _context2.prev = 31;
                    _context2.t1 = _context2["catch"](2);

                    console.error(_context2.t1.stack);

                case 34:
                case "end":
                    return _context2.stop();
            }
        }
    }, _callee2, this, [[2, 31], [6, 17, 21, 29], [22,, 24, 28]]);
}));

var runOnBestDevice = async(regeneratorRuntime.mark(function _callee3(f, name) {
    var platfroms, order;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    platfroms = af.supportedPlatforms();
                    order = ["CUDA", "OpenCL", "CPU"];

                    console.log("Running " + name + " on best available device.\n");
                    _context3.prev = 3;

                    if (!_(platfroms).contains(order[0])) {
                        _context3.next = 9;
                        break;
                    }

                    _context3.next = 7;
                    return runOnDevices(order[0], f, 0);

                case 7:
                    _context3.next = 16;
                    break;

                case 9:
                    if (!_(platfroms).contains(order[1])) {
                        _context3.next = 14;
                        break;
                    }

                    _context3.next = 12;
                    return runOnDevices(order[1], f, 0);

                case 12:
                    _context3.next = 16;
                    break;

                case 14:
                    _context3.next = 16;
                    return runOnDevices(order[2], f, 0);

                case 16:
                    _context3.next = 21;
                    break;

                case 18:
                    _context3.prev = 18;
                    _context3.t0 = _context3["catch"](3);

                    console.error(_context3.t0.stack);

                case 21:
                case "end":
                    return _context3.stop();
            }
        }
    }, _callee3, this, [[3, 18]]);
}));

var printDeviceInfo = function printDeviceInfo(deviceInfo) {
    console.log("ID: " + deviceInfo.id + "\nName: " + deviceInfo.name + "\nPlatform: " + deviceInfo.platform + "\nToolkit: " + deviceInfo.toolkit + "\nCompute: " + deviceInfo.compute);
};

module.exports = {
    runOnAllPlatforms: runOnAllPlatforms,
    runOnBestDevice: runOnBestDevice,
    printDeviceInfo: printDeviceInfo
};
//# sourceMappingURL=index.js.map
