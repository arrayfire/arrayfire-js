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

proto._calculateError = function (out, pred) {
    var dif = out.sub(pred);
    var sq = dif.mul(dif);
    return Math.sqrt(this.af.sum(sq)) / sq.elements();
};

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

proto.train = function (input, target, options) {
    var self = this;
    var af = self.af;
    var Seq = self.af.Seq;

    var numSamples = input.dims(0);
    var numBatches = numSamples / options.batchSize;

    var err = 0;

    for (var i = 0; i < options.maxEpochs; i++) {
        var start = now();

        var _loop3 = function _loop3(j) {
            af.scope(function () {
                var startPos = j * options.batchSize;
                var endPos = startPos + options.batchSize - 1;

                var x = input.at(new Seq(startPos, endPos), af.span);
                var y = target.at(new Seq(startPos, endPos), af.span);

                self.forwardPropagate(x);
                self.backPropagate(y, options.alpha);
            });
        };

        for (var j = 0; j < numBatches - 1; j++) {
            _loop3(j);
        }

        af.scope(function () {
            // Validate with last batch
            var startPos = (numBatches - 1) * options.batchSize;
            var endPos = numSamples - 1;
            var outVec = self.predict(input.at(new Seq(startPos, endPos), af.span));
            err = self._calculateError(outVec, target.at(new Seq(startPos, endPos), af.span));
        });

        var end = now();
        console.log("Epoch: " + (i + 1) + ", Error: " + err.toFixed(6) + ", Duration: " + ((end - start) / 1000).toFixed(4) + " seconds");

        // Check if convergence criteria has been met
        if (err < options.maxError) {
            console.log("Converged on Epoch: " + (i + 1));
            break;
        }
    }

    return err;
};

module.exports = ANN;
//# sourceMappingURL=ann.js.map
