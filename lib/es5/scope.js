"use strict";
var Bluebird = require("bluebird");
var _ = require("lodash");
var temporaries = [];
function scope(f) {
  if (_.isFunction(f)) {
    scope.begin();
    try {
      var result = f.call(scope);
      if (_.isObject(result) && _.isFunction(result.then)) {
        return Bluebird.resolve(result).then(function() {
          return scope;
        }).finally(function() {
          scope.end();
        });
      } else {
        scope.end();
        return scope;
      }
    } catch (e) {
      scope.end();
      throw e;
    }
  }
}
scope.begin = function() {
  temporaries.push(new Set());
  return scope;
};
scope.end = function() {
  if (temporaries.length) {
    var set = temporaries[temporaries.length - 1];
    temporaries.length--;
    free(set);
  }
  return scope;
};
scope.register = function(array) {
  if (temporaries.length && _.isObject(array) && _.isFunction(array.free)) {
    var set = temporaries[temporaries.length - 1];
    set.add(array);
  }
};
scope.result = function(array) {
  if (temporaries.length && _.isObject(array)) {
    var set = temporaries[temporaries.length - 1];
    set.delete(array);
  }
  return scope;
};
function free(arrays) {
  var $__3 = true;
  var $__4 = false;
  var $__5 = undefined;
  try {
    for (var $__1 = void 0,
        $__0 = (arrays.values())[Symbol.iterator](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
      var array = $__1.value;
      {
        array.free();
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
}
module.exports = scope;

//# sourceMappingURL=scope.js.map
