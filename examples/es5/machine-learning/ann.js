"use strict";

var _ = require("lodash");
var Bluebird = require("bluebird");
var async = Bluebird.coroutine;
var debug = require("debug")("af:ann");
var now = require("performance-now");

function ANN(af, layers, range) {
    range = range || 0.05;
    this.af = af;
    this.numLayers = layers.length;
    this.signal = [];
    this.weights = [];
    for (var i = 0; i < this.numLayers; i++) {
        this.signal.push(new af.AFArray());
        if (i < this.numLayers - 1) {
            var w = af.randu(layers[i] + 1, layers[i + 1], af.dType.f32).mul(range).sub(range / 2);
            this.weights.push(w);
        }
    }
}

var proto = ANN.prototype;

proto.deriv = function (out) {
    return out.rhsSub(1).mul(out);
};

proto.addBias = function (input) {
    return this.af.join(1, this.af.constant(1, input.dims(0), this.af.dType.f32), input);
};

proto._calculateError = async(regeneratorRuntime.mark(function _callee(out, pred) {
    var dif, sq;
    return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    dif = out.sub(pred);
                    sq = dif.mul(dif);
                    _context.next = 4;
                    return this.af.syncAsync();

                case 4:
                    _context.t0 = Math;
                    _context.next = 7;
                    return this.af.sumAsync(sq);

                case 7:
                    _context.t1 = _context.sent;
                    _context.t2 = _context.t0.sqrt.call(_context.t0, _context.t1);
                    _context.t3 = sq.elements();
                    return _context.abrupt("return", _context.t2 / _context.t3);

                case 11:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}));

proto.forwardPropagate = function (input) {
    var _this = this;

    this.signal[0].set(input);

    var _loop = function _loop(i) {
        var self = _this;
        _this.af.scope(function () {
            var inVec = self.addBias(self.signal[i]);
            var outVec = self.af.matMul(inVec, self.weights[i]);
            self.signal[i + 1].set(self.af.sigmoid(outVec));
        });
    };

    for (var i = 0; i < this.numLayers - 1; i++) {
        _loop(i);
    }
};

proto.backPropagate = function (target, alpha) {
    var self = this;
    var af = self.af;
    var Seq = self.af.Seq;

    // Get error for output layer
    af.scope(function () {
        var outVec = self.signal[self.numLayers - 1];
        var err = outVec.sub(target);
        var m = target.dims(0);

        var _loop2 = function _loop2(i) {
            af.scope(function () {
                var inVec = self.addBias(self.signal[i]);
                var delta = af.transpose(self.deriv(outVec).mul(err));

                // Adjust weights
                var grad = af.matMul(delta, inVec).mul(alpha).neg().div(m);
                self.weights[i].addAssign(af.transpose(grad));

                // Input to current layer is output of previous
                outVec = self.signal[i];
                err.set(self.af.matMulTT(delta, self.weights[i]));

                // Remove the error of bias and propagate backward
                err.set(err.at(af.span, new Seq(1, outVec.dims(1))));
            });
        };

        for (var i = self.numLayers - 2; i >= 0; i--) {
            _loop2(i);
        }
    });
};

proto.predict = function (input) {
    this.forwardPropagate(input);
    return this.signal[this.numLayers - 1].copy();
};

proto.train = async(regeneratorRuntime.mark(function _callee3(input, target, options) {
    var self, af, Seq, numSamples, numBatches, err, i, start, _loop3, j, end;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    self = this;
                    af = self.af;
                    Seq = self.af.Seq;
                    numSamples = input.dims(0);
                    numBatches = numSamples / options.batchSize;
                    err = 0;
                    i = 0;

                case 7:
                    if (!(i < options.maxEpochs)) {
                        _context3.next = 21;
                        break;
                    }

                    start = now();

                    _loop3 = function _loop3(j) {
                        af.scope(function () {
                            var startPos = j * options.batchSize;
                            var endPos = startPos + options.batchSize - 1;

                            var x = input.at(new Seq(startPos, endPos), af.span);
                            var y = target.at(new Seq(startPos, endPos), af.span);

                            self.forwardPropagate(x);
                            self.backPropagate(y, options.alpha);
                        });
                    };

                    for (j = 0; j < numBatches - 1; j++) {
                        _loop3(j);
                    }

                    _context3.next = 13;
                    return af.scope(async(regeneratorRuntime.mark(function _callee2() {
                        var startPos, endPos, outVec;
                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        // Validate with last batch
                                        startPos = (numBatches - 1) * options.batchSize;
                                        endPos = numSamples - 1;
                                        outVec = self.predict(input.at(new Seq(startPos, endPos), af.span));
                                        _context2.next = 5;
                                        return self._calculateError(outVec, target.at(new Seq(startPos, endPos), af.span));

                                    case 5:
                                        err = _context2.sent;

                                    case 6:
                                    case "end":
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, this);
                    })));

                case 13:
                    end = now();

                    console.log("Epoch: " + (i + 1) + ", Error: " + err.toFixed(6) + ", Duration: " + ((end - start) / 1000).toFixed(4) + " seconds");

                    // Check if convergence criteria has been met

                    if (!(err < options.maxError)) {
                        _context3.next = 18;
                        break;
                    }

                    console.log("Converged on Epoch: " + (i + 1));
                    return _context3.abrupt("break", 21);

                case 18:
                    i++;
                    _context3.next = 7;
                    break;

                case 21:
                    return _context3.abrupt("return", err);

                case 22:
                case "end":
                    return _context3.stop();
            }
        }
    }, _callee3, this);
}));

module.exports = ANN;
//# sourceMappingURL=ann.js.map
