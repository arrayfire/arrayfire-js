"use strict";
var _ = require("lodash");
var assert = require("better-assert");
function Dim4(dim0, dim1, dim2, dim3) {
  if (_.isArray(dim0)) {
    return new Dim4(dim0[0], dim0[1], dim0[2], dim0[3]);
  }
  this.values = [];
  if (_.isNumber(dim0)) {
    this.values.push(dim0);
  } else {
    this.values.push(1);
  }
  if (_.isNumber(dim1)) {
    this.values.push(dim1);
  } else {
    this.values.push(1);
  }
  if (_.isNumber(dim2)) {
    this.values.push(dim2);
  } else {
    this.values.push(1);
  }
  if (_.isNumber(dim3)) {
    this.values.push(dim3);
  } else {
    this.values.push(1);
  }
  var index;
  for (index = 3; index >= 0; index--) {
    if (this.values[index] !== 1) {
      break;
    }
  }
  this.ndims = this.nDims = index + 1;
  this.elements = this.values[0] * this.values[1] * this.values[2] * this.values[3];
}
module.exports = Dim4;

//# sourceMappingURL=dim4.js.map
