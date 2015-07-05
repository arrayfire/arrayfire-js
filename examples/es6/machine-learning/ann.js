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
}

proto.addBias = function() {
    return this.af.join(1, this.af.constant(1, input.dims(0), 1, this.af.dType.f32), input);
};

module.exports = ANN;