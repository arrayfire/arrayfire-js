"use strict";
var _ = require("lodash");
var ext = require("./ext");
var Bluebird = require("bluebird");
var entry = module.exports = function(id) {
  var did = _.isString(id) ? id.trim().toLowerCase() : null;
  did = did || "cpu";
  function createAF() {
    switch (did) {
      case "cpu":
        return require("bindings")("arrayfire_js_CPU");
      case "cuda":
        return require("bindings")("arrayfire_js_CUDA");
      case "opencl":
        return require("bindings")("arrayfire_js_OpenCL");
      default:
        throw new Error("Platform '" + id + "' is not supported.");
    }
  }
  var af = createAF();
  if (!af.__extended) {
    ext(af);
    af.__extended = true;
  }
  return af;
};
entry.supportedPlatforms = function() {
  var platforms = [];
  var $__3 = true;
  var $__4 = false;
  var $__5 = undefined;
  try {
    for (var $__1 = void 0,
        $__0 = (["CPU", "CUDA", "OpenCL"])[Symbol.iterator](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
      var id = $__1.value;
      {
        try {
          var fire = entry(id);
          platforms.push(id);
        } catch (e) {}
      }
    }
  } catch ($__6) {
    $__4 = true;
    $__5 = $__6;
  } finally {
    try {
      if (!$__3 && $__0.return != null) {
        $__0.return();
      }
    } finally {
      if ($__4) {
        throw $__5;
      }
    }
  }
  return platforms;
};

//# sourceMappingURL=index.js.map
