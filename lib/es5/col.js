"use strict";
var _ = require("lodash");
var assert = require("better-assert");
function Col(index) {
  assert(_.isNumber(index));
  this.index = index;
}
module.exports = Col;

//# sourceMappingURL=col.js.map
