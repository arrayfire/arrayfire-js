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
/* global describe,it */

var assert = require("better-assert");
var _ = require("lodash");
var ref = require("ref");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var testExec = require("./testExec");
var float = ref.types.float;

describe("gfor", function () {
    testExec.run(function (af) {
        it("should work", function (done) {
            async(regeneratorRuntime.mark(function _callee() {
                var count, arr, val, idx, sum;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                count = 20;
                                arr = af.constant(0.0, count, 10, af.dType.f32);
                                val = af.range(new af.Dim4(1, 10), 1, af.dType.f32);

                                af.gfor(count, function (seq) {
                                    assert(seq instanceof af.Seq);
                                    assert(seq.begin === 0);
                                    assert(seq.end === 19);
                                    assert(seq.isGFor);
                                    arr.assign(seq, af.span, val);
                                });
                                idx = 0;

                            case 5:
                                if (!(idx < count)) {
                                    _context.next = 13;
                                    break;
                                }

                                _context.next = 8;
                                return af.sumAsync(arr.at(idx, af.span));

                            case 8:
                                sum = _context.sent;

                                assert(sum === 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9);

                            case 10:
                                idx++;
                                _context.next = 5;
                                break;

                            case 13:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }))().asCallback(done);
        });
    });
});
//# sourceMappingURL=gfor.js.map
