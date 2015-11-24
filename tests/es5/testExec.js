"use strict";
var af = require("../..");
function runOn(id, f) {
  describe(id + " platform", function() {
    var afID = af(id);
    f(afID);
  });
}
var testExec = {run: function(f) {
    var platfroms = af.supportedPlatforms();
    var $__4 = true;
    var $__5 = false;
    var $__6 = undefined;
    try {
      for (var $__2 = void 0,
          $__1 = (platfroms)[Symbol.iterator](); !($__4 = ($__2 = $__1.next()).done); $__4 = true) {
        var pl = $__2.value;
        {
          runOn(pl, f);
        }
      }
    } catch ($__7) {
      $__5 = true;
      $__6 = $__7;
    } finally {
      try {
        if (!$__4 && $__1.return != null) {
          $__1.return();
        }
      } finally {
        if ($__5) {
          throw $__6;
        }
      }
    }
  }};
module.exports = testExec;

//# sourceMappingURL=testExec.js.map
