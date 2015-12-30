"use strict";

let _ = require("lodash");
let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let debug = require("debug")("af:ann");
let now = require("performance-now");

function ANN(af, layers, range) {
    range = range || 0.05;
    this.af = af;
    this.numLayers = layers.length;
    this.signal = [];
    this.weights = [];
    for (let i = 0; i < this.numLayers; i++) {
        this.signal.push(new af.AFArray());
        if (i < this.numLayers - 1) {
            let w = af.randu(layers[i] + 1, layers[i + 1], af.dType.f32).mul(range).sub(range / 2);
            this.weights.push(w);
        }
    }
}

let proto = ANN.prototype;

proto.deriv = function (out) {
    return out.rhsSub(1).mul(out);
};

proto.addBias = function (input) {
    return this.af.join(1, this.af.constant(1, input.dims(0), this.af.dType.f32), input);
};

proto._calculateError = async(function*(out, pred) {
    let dif = out.sub(pred);
    let sq = dif.mul(dif);
    yield this.af.syncAsync();
    return 5;//Math.sqrt(yield this.af.sumAsync(sq)) / sq.elements();
});

proto.forwardPropagate = function (input) {
    this.signal[0].set(input);
    for (let i = 0; i < this.numLayers - 1; i++) {
        let self = this;
        this.af.scope(function() {
            let inVec = self.addBias(self.signal[i]);
            let outVec = self.af.matMul(inVec, self.weights[i]);
            self.signal[i + 1].set(self.af.sigmoid(outVec));
        });
    }
};

proto.backPropagate = function (target, alpha) {
    let self = this;
    let af = self.af;
    let Seq = self.af.Seq;

    // Get error for output layer
    af.scope(function() {
        let outVec = self.signal[self.numLayers - 1];
        let err = outVec.sub(target);
        let m = target.dims(0);

        for (let i = self.numLayers - 2; i >= 0; i--) {
            af.scope(function() {
                let inVec = self.addBias(self.signal[i]);
                let delta = af.transpose(self.deriv(outVec).mul(err));

                // Adjust weights
                let grad = af.matMul(delta, inVec).mul(alpha).neg().div(m);
                self.weights[i].addAssign(af.transpose(grad));

                // Input to current layer is output of previous
                outVec = self.signal[i];
                err.set(self.af.matMulTT(delta, self.weights[i]));

                // Remove the error of bias and propagate backward
                err.set(err.at(af.span, new Seq(1, outVec.dims(1))));
            });
        }
    });
};

proto.predict = function (input) {
    this.forwardPropagate(input);
    return this.signal[this.numLayers - 1].copy();
};

proto.train = async(function*(input, target, options) {
    let self = this;
    let af = self.af;
    let Seq = self.af.Seq;

    let numSamples = input.dims(0);
    let numBatches = numSamples / options.batchSize;

    let err = 0;

    for (let i = 0; i < options.maxEpochs; i++) {
        const start = now();
        for (let j = 0; j < numBatches - 1; j++) {
            af.scope(() => {
                let startPos = j * options.batchSize;
                let endPos = startPos + options.batchSize - 1;

                let x = input.at(new Seq(startPos, endPos), af.span);
                let y = target.at(new Seq(startPos, endPos), af.span);

                self.forwardPropagate(x);
                self.backPropagate(y, options.alpha);
            });
        }

        yield af.scope(async(function*() {
            // Validate with last batch
            let startPos = (numBatches - 1) * options.batchSize;
            let endPos = numSamples - 1;
            let outVec = self.predict(input.at(new Seq(startPos, endPos), af.span));
            err = yield self._calculateError(outVec, target.at(new Seq(startPos, endPos), af.span));
        }));

        const end = now();
        console.log(`Epoch: ${i + 1}, Error: ${err.toFixed(6)}, Duration: ${((end - start) / 1000).toFixed(4)} seconds`);

        // Check if convergence criteria has been met
        if (err < options.maxError) {
            console.log(`Converged on Epoch: ${i + 1}`);
            break;
        }
    }

    return err;
});

module.exports = ANN;