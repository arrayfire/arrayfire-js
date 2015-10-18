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
proto.deriv = function(out) {
  return out.rhsSub(1).mul(out);
};
proto.addBias = function(input) {
  return this.af.join(1, this.af.constant(1, input.dims(0), this.af.dType.f32), input);
};
proto._calculateError = async($traceurRuntime.initGeneratorFunction(function $__2(out, pred) {
  var dif,
      $__3,
      $__4,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          dif = out.sub(pred);
          $ctx.state = 12;
          break;
        case 12:
          $__3 = Math.sqrt;
          $__4 = this.af;
          $__5 = $__4.sumAsync;
          $__6 = dif.mul;
          $__7 = $__6.call(dif, dif);
          $__8 = $__5.call($__4, $__7);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__8;
        case 2:
          $__9 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__10 = $__3.call(Math, $__9);
          $ctx.state = 8;
          break;
        case 8:
          $ctx.returnValue = $__10;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__2, this);
}));
proto.forwardPropagate = function(input) {
  this.signal[0].set(input);
  for (var i = 0; i < this.numLayers - 1; i++) {
    var inVec = this.addBias(this.signal[i]);
    var outVec = this.af.matMul(inVec, this.weights[i]);
    this.signal[i + 1].set(this.af.sigmoid(outVec));
  }
};
proto.backPropagate = function(target, alpha) {
  var af = this.af;
  var Seq = this.af.Seq;
  var outVec = this.signal[this.numLayers - 1];
  var err = outVec.sub(target);
  var m = target.dims(0);
  for (var i = this.numLayers - 2; i >= 0; i--) {
    var inVec = this.addBias(this.signal[i]);
    var delta = af.transpose(this.deriv(outVec).mul(err));
    var grad = af.matMul(delta, inVec).mul(alpha).neg().div(m);
    this.weights[i].addAssign(af.transpose(grad));
    outVec = this.signal[i];
    err.set(this.af.matMulTT(delta, this.weights[i]));
    err.set(err.at(af.span, new Seq(1, outVec.dims(1))));
  }
};
proto.predict = function(input) {
  this.forwardPropagate(input);
  return this.signal[this.numLayers - 1].copy();
};
proto.train = async($traceurRuntime.initGeneratorFunction(function $__11(input, target, options) {
  var af,
      Seq,
      numSamples,
      numBatches,
      err,
      i,
      start,
      j,
      startPos$__0,
      endPos$__1,
      x,
      y,
      startPos,
      endPos,
      outVec,
      end;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          af = this.af;
          Seq = this.af.Seq;
          numSamples = input.dims(0);
          numBatches = numSamples / options.batchSize;
          err = 0;
          $ctx.state = 20;
          break;
        case 20:
          i = 0;
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = (i < options.maxEpochs) ? 10 : 14;
          break;
        case 6:
          i++;
          $ctx.state = 16;
          break;
        case 10:
          start = now();
          for (j = 0; j < numBatches - 1; j++) {
            startPos$__0 = j * options.batchSize;
            endPos$__1 = startPos$__0 + options.batchSize - 1;
            x = input.at(new Seq(startPos$__0, endPos$__1), af.span);
            y = target.at(new Seq(startPos$__0, endPos$__1), af.span);
            this.forwardPropagate(x);
            this.backPropagate(y, options.alpha);
          }
          startPos = (numBatches - 1) * options.batchSize;
          endPos = numSamples - 1;
          outVec = this.predict(input.at(new Seq(startPos, endPos), af.span));
          $ctx.state = 11;
          break;
        case 11:
          $ctx.state = 2;
          return this._calculateError(outVec, target.at(new Seq(startPos, endPos), af.span));
        case 2:
          err = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          end = now();
          console.log(("Epoch: " + (i + 1) + ", Error: " + err.toFixed(4) + ", Duration: " + ((end - start) / 1000).toFixed(4) + " seconds"));
          $ctx.state = 13;
          break;
        case 13:
          $ctx.state = (err < options.maxError) ? 7 : 6;
          break;
        case 7:
          console.log(("Converged on Epoc: " + (i + 1)));
          $ctx.state = 14;
          break;
        case 14:
          $ctx.returnValue = err;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}));
module.exports = ANN;

//# sourceMappingURL=ann.js.map
