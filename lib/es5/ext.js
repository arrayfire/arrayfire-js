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
var _ = require("lodash");
var async = Bluebird.coroutine;

var retryCount = 5;
var gcTime = 1000;

function isOutOfMemoryError(e) {
    return e.message.indexOf("out of memory") > 0;
}

function invokeGC(af) {
    af.gc(gcTime);
}

function synchronify(af, f) {
    return function () {
        var err;
        var res;
        var done;
        var cb = function cb(e, r) {
            err = e;
            res = r;
            done = true;
        };

        var args = _.toArray(arguments).concat(cb);

        for (var i = 0; i < retryCount; i++) {
            done = false;
            f.apply(this, args);
            while (!done) {
                af._doEvents();
            }if (err) {
                if (!isOutOfMemoryError(err)) {
                    throw err;
                } else {
                    invokeGC(af);
                }
            }
        }

        if (err) throw err;

        return res;
    };
}

function installAsyncAndSync(af, obj, name) {
    if (_.isUndefined(name)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                installAsyncAndSync(af, obj, key);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return;
    }

    if (name !== "AFArray") {
        (function () {
            var f = obj[name];
            if (_.isFunction(f)) {
                if (!_.isFunction(obj[name + "Async"])) {
                    obj[name + "Async"] = async(regeneratorRuntime.mark(function _callee() {
                        var self,
                            args,
                            call,
                            err,
                            i,
                            _args = arguments;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        self = this;
                                        args = _.toArray(_args);

                                        call = function call() {
                                            return new Bluebird(function (resolve, reject) {
                                                var cb = function cb(e, r) {
                                                    if (e) {
                                                        reject(e);
                                                    } else {
                                                        resolve(r);
                                                    }
                                                };
                                                args.push(cb);
                                                f.apply(self, args);
                                            });
                                        };

                                        err = null;
                                        i = 0;

                                    case 5:
                                        if (!(i < retryCount)) {
                                            _context.next = 21;
                                            break;
                                        }

                                        _context.prev = 6;
                                        _context.next = 9;
                                        return call();

                                    case 9:
                                        return _context.abrupt("return", _context.sent);

                                    case 12:
                                        _context.prev = 12;
                                        _context.t0 = _context["catch"](6);

                                        if (isOutOfMemoryError(_context.t0)) {
                                            _context.next = 16;
                                            break;
                                        }

                                        throw _context.t0;

                                    case 16:
                                        invokeGC(af);
                                        err = _context.t0;

                                    case 18:
                                        i++;
                                        _context.next = 5;
                                        break;

                                    case 21:
                                        throw err;

                                    case 22:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        }, _callee, this, [[6, 12]]);
                    }));
                }
                if (!_.isFunction(obj[name + "Sync"])) {
                    obj[name + "Sync"] = synchronify(af, f);
                }
                obj[name] = function () {
                    var err = null;
                    for (var _i = 0; _i < retryCount; _i++) {
                        try {
                            return f.apply(this, arguments);
                        } catch (e) {
                            if (!isOutOfMemoryError(e)) {
                                throw e;
                            }
                            invokeGC(af);
                            err = e;
                        }
                    }
                    throw err;
                };
            }
        })();
    }
}

function ext(af) {
    installAsyncAndSync(af, af);
    installAsyncAndSync(af, af.AFArray);
    installAsyncAndSync(af, af.AFArray.prototype);

    var scope = af.AFArray.scope = require("./scope");

    _.extend(af, {
        end: -1,
        span: null,
        all: -1,
        dtype: require("./dtype"),
        dType: require("./dtype"),
        source: require("./source"),
        matchType: require("./matchType"),
        cSpace: require("./cSpace"),
        CSpace: require("./cSpace"),
        connectivity: require("./connectivity"),
        borderType: require("./borderType"),
        interpType: require("./interpType"),
        matProp: require("./matProp"),
        normType: require("./normType"),
        convMode: require("./convMode"),
        convDomain: require("./convDomain"),
        Dim4: require("./dim4"),
        Seq: require("./seq"),
        Complex: require("./complex"),
        Row: require("./row"),
        Col: require("./col"),
        Rows: require("./rows"),
        Cols: require("./cols"),
        getDevices: function getDevices() {
            var current = this.getDevice();
            try {
                var count = this.getDeviceCount();
                var result = [];
                for (var _i2 = 0; _i2 < count; _i2++) {
                    this.setDevice(_i2);
                    var info = this.deviceInfo();
                    info.id = _i2;
                    result.push(info);
                }
                return result;
            } finally {
                this.setDevice(current);
            }
        },
        gfor: require("./makeGfor")(af),
        scope: scope
    });
}

module.exports = ext;
//# sourceMappingURL=ext.js.map
