"use strict";
var _ = require("lodash");
var assert = require("better-assert");
function Row(index) {
  assert(_.isNumber(index));
  this.index = index;
}
module.exports = Row;

//# sourceMappingURL=row.js.map
