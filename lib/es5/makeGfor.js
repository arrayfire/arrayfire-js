"use strict";
var _ = require("lodash");
var assert = require("better-assert");
var Seq = require("./seq");
function makeGfor(af) {
  return function gfor() {
    var fPos = -1;
    for (var i = 0; i < arguments.length; i++) {
      if (_.isFunction(arguments[i])) {
        fPos = i;
        break;
      }
    }
    if (fPos === -1) {
      throw new Error("Body function argument expected.");
    }
    if (fPos === 0) {
      throw new Error("Seq arguments expected.");
    }
    var thisArg = arguments[fPos];
    if (arguments.length > fPos + 1 && _.isObject(fPos + 1)) {
      thisArg = arguments[fPos + 1];
    }
    var seq;
    if (fPos === 1) {
      seq = new Seq(arguments[0]);
    } else if (fPos === 2) {
      seq = new Seq(arguments[0], arguments[1]);
    } else {
      throw new Error("Invalid number of Seq arguments.");
    }
    seq.isGFor = true;
    af._gforToggle();
    try {
      arguments[fPos].call(thisArg, seq);
    } finally {
      af._gforToggle();
    }
  };
}
module.exports = makeGfor;

//# sourceMappingURL=makeGfor.js.map
