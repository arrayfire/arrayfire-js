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
proto._calculateError = async($traceurRuntime.initGeneratorFunction(function $__4(out, pred) {
  var dif,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11,
      $__12;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          dif = out.sub(pred);
          $ctx.state = 12;
          break;
        case 12:
          $__5 = Math.sqrt;
          $__6 = this.af;
          $__7 = $__6.sumAsync;
          $__8 = dif.mul;
          $__9 = $__8.call(dif, dif);
          $__10 = $__7.call($__6, $__9);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__10;
        case 2:
          $__11 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__12 = $__5.call(Math, $__11);
          $ctx.state = 8;
          break;
        case 8:
          $ctx.returnValue = $__12;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__4, this);
}));
proto.forwardPropagate = function(input) {
  this.signal[0].set(input);
  var $__0 = this,
      $__1 = function(i) {
        var self = $__0;
        $__0.af.scope(function() {
          var inVec = self.addBias(self.signal[i]);
          var outVec = self.af.matMul(inVec, self.weights[i]);
          self.signal[i + 1].set(self.af.sigmoid(outVec));
        });
      };
  for (var i = 0; i < this.numLayers - 1; i++) {
    $__1(i);
  }
};
proto.backPropagate = function(target, alpha) {
  var self = this;
  var af = self.af;
  var Seq = self.af.Seq;
  af.scope(function() {
    var outVec = self.signal[self.numLayers - 1];
    var err = outVec.sub(target);
    var m = target.dims(0);
    var $__2 = function(i) {
      af.scope(function() {
        var inVec = self.addBias(self.signal[i]);
        var delta = af.transpose(self.deriv(outVec).mul(err));
        var grad = af.matMul(delta, inVec).mul(alpha).neg().div(m);
        self.weights[i].addAssign(af.transpose(grad));
        outVec = self.signal[i];
        err.set(self.af.matMulTT(delta, self.weights[i]));
        err.set(err.at(af.span, new Seq(1, outVec.dims(1))));
      });
    };
    for (var i = self.numLayers - 2; i >= 0; i--) {
      $__2(i);
    }
  });
};
proto.predict = function(input) {
  this.forwardPropagate(input);
  return this.signal[this.numLayers - 1].copy();
};
proto.train = async($traceurRuntime.initGeneratorFunction(function $__13(input, target, options) {
  var self,
      af,
      Seq,
      numSamples,
      numBatches,
      err,
      i,
      start,
      $__3,
      j,
      end,
      $__16,
      $__17;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          self = this;
          af = self.af;
          Seq = self.af.Seq;
          numSamples = input.dims(0);
          numBatches = numSamples / options.batchSize;
          err = 0;
          $ctx.state = 35;
          break;
        case 35:
          i = 0;
          $ctx.state = 31;
          break;
        case 31:
          $ctx.state = (i < options.maxEpochs) ? 25 : 29;
          break;
        case 21:
          i++;
          $ctx.state = 31;
          break;
        case 25:
          start = now();
          $__3 = $traceurRuntime.initGeneratorFunction(function $__14(j) {
            return $traceurRuntime.createGeneratorInstance(function($ctx) {
              while (true)
                switch ($ctx.state) {
                  case 0:
                    af.scope(function() {
                      var startPos = j * options.batchSize;
                      var endPos = startPos + options.batchSize - 1;
                      var x = input.at(new Seq(startPos, endPos), af.span);
                      var y = target.at(new Seq(startPos, endPos), af.span);
                      self.forwardPropagate(x);
                      self.backPropagate(y, options.alpha);
                    });
                    $ctx.state = -2;
                    break;
                  default:
                    return $ctx.end();
                }
            }, $__14, this);
          });
          $ctx.state = 26;
          break;
        case 26:
          j = 0;
          $ctx.state = 15;
          break;
        case 15:
          $ctx.state = (j < numBatches - 1) ? 11 : 13;
          break;
        case 10:
          j++;
          $ctx.state = 15;
          break;
        case 11:
          $__16 = $ctx.wrapYieldStar($__3(j)[Symbol.iterator]());
          $ctx.sent = void 0;
          $ctx.action = 'next';
          $ctx.state = 12;
          break;
        case 12:
          $__17 = $__16[$ctx.action]($ctx.sentIgnoreThrow);
          $ctx.state = 9;
          break;
        case 9:
          $ctx.state = ($__17.done) ? 3 : 2;
          break;
        case 3:
          $ctx.sent = $__17.value;
          $ctx.state = 10;
          break;
        case 2:
          $ctx.state = 12;
          return $__17.value;
        case 13:
          $ctx.state = 17;
          return af.scope(async($traceurRuntime.initGeneratorFunction(function $__15() {
            var startPos,
                endPos,
                outVec;
            return $traceurRuntime.createGeneratorInstance(function($ctx) {
              while (true)
                switch ($ctx.state) {
                  case 0:
                    startPos = (numBatches - 1) * options.batchSize;
                    endPos = numSamples - 1;
                    outVec = self.predict(input.at(new Seq(startPos, endPos), af.span));
                    $ctx.state = 6;
                    break;
                  case 6:
                    $ctx.state = 2;
                    return self._calculateError(outVec, target.at(new Seq(startPos, endPos), af.span));
                  case 2:
                    err = $ctx.sent;
                    $ctx.state = -2;
                    break;
                  default:
                    return $ctx.end();
                }
            }, $__15, this);
          })));
        case 17:
          $ctx.maybeThrow();
          $ctx.state = 19;
          break;
        case 19:
          end = now();
          console.log(("Epoch: " + (i + 1) + ", Error: " + err.toFixed(4) + ", Duration: " + ((end - start) / 1000).toFixed(4) + " seconds"));
          $ctx.state = 28;
          break;
        case 28:
          $ctx.state = (err < options.maxError) ? 22 : 21;
          break;
        case 22:
          console.log(("Converged on Epoc: " + (i + 1)));
          $ctx.state = 29;
          break;
        case 29:
          $ctx.returnValue = err;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__13, this);
}));
module.exports = ANN;

//# sourceMappingURL=ann.js.map
