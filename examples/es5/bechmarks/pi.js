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
var common = require("../common");

var numberOfPoints = 20000000;

var pi = async(regeneratorRuntime.mark(function _callee(af, deviceInfo) {
    var AFArray, x, y, dist, numInside, piVal;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    AFArray = af.AFArray;

                    console.log("Calculating pi on device:\n");
                    common.printDeviceInfo(deviceInfo);
                    console.log("");

                    x = af.randu(numberOfPoints, af.dtype.f32);
                    y = af.randu(numberOfPoints, af.dtype.f32);
                    dist = af.sqrt(x.mul(x).add(y.mul(y)));
                    _context.next = 9;
                    return af.sumAsync(dist.lt(1));

                case 9:
                    numInside = _context.sent;
                    piVal = 4.0 * numInside / numberOfPoints;

                    console.log("PI = " + piVal);

                case 12:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

common.runOnAllPlatforms(pi, "pi example");
//# sourceMappingURL=pi.js.map
