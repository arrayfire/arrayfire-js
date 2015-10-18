"use strict";
var _ = require("lodash");
var assert = require("better-assert");
function Complex(real, imag) {
  assert(_.isNumber(real));
  assert(_.isNumber(imag));
  this.real = real;
  this.imag = imag;
}
module.exports = Complex;

//# sourceMappingURL=complex.js.map
