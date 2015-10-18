"use strict";
var _ = require("lodash");
var assert = require("better-assert");
function Seq(begin, end, step) {
  assert(_.isNumber(begin));
  if (_.isUndefined(end)) {
    begin = 0;
    end = begin;
  } else {
    assert(_.isNumber(end));
  }
  step = step || 1;
  assert(_.isNumber(step));
  this.begin = begin;
  this.end = end;
  this.step = step;
  this.isGFor = false;
}
module.exports = Seq;

//# sourceMappingURL=seq.js.map
