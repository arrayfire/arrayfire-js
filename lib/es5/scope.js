"use strict";

var Bluebird = require("bluebird");
var _ = require("lodash");

var temporaries = [];

function scope(f) {
    if (_.isFunction(f)) {
        scope.begin();
        try {
            return f.call(scope, scope);
        } finally {
            scope.end();
        }
    }
}

scope.begin = function () {
    temporaries.push(new Set());
    return scope;
};

scope.end = function () {
    if (temporaries.length) {
        var set = temporaries[temporaries.length - 1];
        temporaries.length--;
        free(set);
    }
    return scope;
};

scope.register = function (array) {
    if (temporaries.length && _.isObject(array) && _.isFunction(array.free)) {
        var set = temporaries[temporaries.length - 1];
        set.add(array);
    }
};

scope.result = function (array) {
    if (temporaries.length && _.isObject(array)) {
        var set = temporaries[temporaries.length - 1];
        set.delete(array);
    }
    return array;
};

function free(arrays) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = arrays.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var array = _step.value;

            array.free();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

module.exports = scope;
//# sourceMappingURL=scope.js.map
