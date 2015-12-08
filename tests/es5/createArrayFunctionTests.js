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

"use strict"
/* global describe,it */
;
var assert = require("better-assert");
var _ = require("lodash");
var ref = require("ref");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var int = ref.types.int;
var float = ref.types.float;
var testExec = require("./testExec");

describe("Functions to create arrays", function () {
    testExec.run(function (af) {
        describe("randu", function () {
            it("should yield uniform random int array with 2 dimensions", function (done) {
                var f = async(regeneratorRuntime.mark(function _callee() {
                    var array, data, i, v;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    array = af.randu(2, 4, af.dType.s32);
                                    _context.next = 3;
                                    return array.copyToHostAsync();

                                case 3:
                                    data = _context.sent;

                                    assert(data instanceof Buffer);
                                    assert(data.length == 2 * 4 * int.size);

                                    for (i = 0; i < data.length / int.size; i++) {
                                        v = int.get(data, i * int.size);

                                        assert(v >= Number.MIN_SAFE_INTEGER && v <= Number.MAX_SAFE_INTEGER);
                                        assert(Math.floor(v) === v);
                                    }

                                case 7:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));
                f().nodeify(done);
            });
            it("should yield uniform random float array with 2 dimensions", function (done) {
                var f = async(regeneratorRuntime.mark(function _callee2() {
                    var array, data, _i, _v;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    array = af.randu([2, 4], af.dType.f32);
                                    _context2.next = 3;
                                    return array.copyToHostAsync();

                                case 3:
                                    data = _context2.sent;

                                    assert(data instanceof Buffer);
                                    assert(data.length == 2 * 4 * float.size);

                                    for (_i = 0; _i < data.length / float.size; _i++) {
                                        _v = float.get(data, _i * float.size);

                                        assert(_v === 0 || _v === 1.0 || _v > 0 && _v < 1.0 && _v % 1);
                                    }

                                case 7:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));
                f().nodeify(done);
            });
        });

        describe("randf", function () {
            it("should throw error when invoking normal random int array with 2 dimensions", function () {
                try {
                    var array = af.randn(2, 4, af.dType.s32);
                    return;
                } catch (e) {
                    if (/invalid dtype argument/ig.test(e.message)) {
                        return;
                    } else {
                        throw new Error("This should throw appropriate error.");
                    }
                }
                throw new Error("This should throw.");
            });
            it("should yield normal random float array with 2 dimensions", function (done) {
                var f = async(regeneratorRuntime.mark(function _callee3() {
                    var array, data, _i2, _v2;

                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    array = af.randn([2, 4], af.dType.f32);
                                    _context3.next = 3;
                                    return array.copyToHostAsync();

                                case 3:
                                    data = _context3.sent;

                                    assert(data instanceof Buffer);
                                    assert(data.length == 2 * 4 * float.size);

                                    for (_i2 = 0; _i2 < data.length / float.size; _i2++) {
                                        _v2 = float.get(data, _i2 * float.size);

                                        assert(_v2 === 0 || _v2 > -4.0 && _v2 < 4.0 && _v2 % 1);
                                    }

                                case 7:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));
                f().nodeify(done);
            });
        });
    });
});
//# sourceMappingURL=createArrayFunctionTests.js.map
