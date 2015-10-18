"use strict";
var _ = require("lodash");
var assert = require("better-assert");
function Cols(firstIndex, lastIndex) {
  assert(_.isNumber(firstIndex));
  assert(_.isNumber(lastIndex));
  this.firstIndex = firstIndex;
  this.lastIndex = lastIndex;
}
module.exports = Cols;

//# sourceMappingURL=cols.js.map
