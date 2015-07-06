"use strict";

let _ = require("lodash");

function ANN(af, layers, range) {
    range = range || 0.05;
    this.af = af;
    this.numLayers = layers.size;
    this.signal = [];
    this.weights = [];
    for (let i = 0; i < this.numLayers; i++) {
        this.signal.push(new af.AFArray());
        if (i > 0) {
            let w = af.randu(layers[i] + 1, layers[i + 1]).mul(range).sub(range / 2);
            this.weights.push(w);
        }
    }
}

let proto = ANN.prototype;

proto.sigmoid = function (val) {
    // 1 / (1 + exp(-val));
    return this.af.exp(val.neg()).add(1).rhsDiv(1);
};

proto.deriv = function (out) {
    return out.rhsSub(1).mul(out);
};

proto.addBias = function (input) {
    return this.af.join(1, this.af.constant(1, input.dims(0), 1, this.af.dType.f32), input);
};

proto.forwardPropagate = function (input) {
    this.signal[0].set(input);
    for (let i = 0; i < this.numLayers - 1; i++) {
        let inVec = this.addBias(input);
        let outVec = this.af.matMul(inVec, this.weights[i]);
        this.signal[i + 1].set(this.sigmoid(outVec));
    }
};

proto.backPropagate = function(target, alpha) {
    // Get error for output layer
    let out = this.signal[this.numLayers - 1];
    let err = out.sub(target);
    let m = target.dims(0);
};

/*
void ann::back_propagate(const vector<array> signal,
                         const array &target,
                         const double &alpha)
{

    // Get error for output layer
    array out = signal[num_layers  - 1];
    array err = (out - target);
    int m = target.dims(0);

    for (int i = num_layers - 2; i >= 0; i--) {
        array in = add_bias(signal[i]);
        array delta = (deriv(out) * err).T();

        // Adjust weights
        array grad = -(alpha * matmul(delta, in)) / m;
        weights[i] += grad.T();

        // Input to current layer is output of previous
        out = signal[i];
        err = matmul(weights[i], delta).T();

        // Remove the error of bias and propagate backward
        err = err(span, seq(1, out.dims(1)));
    }
}
*/

proto.predict = function(input) {
    this.forwardPropagate(input);
    return this.signal[this.numLayers - 1].copy();
};

module.exports = ANN;