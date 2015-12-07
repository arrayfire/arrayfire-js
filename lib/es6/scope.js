"use strict";
let Bluebird = require("bluebird");
let _ = require("lodash");

let temporaries = [];

function scope(f) {
    if (_.isFunction(f)) {
        scope.begin();
        try {
            let result = f.call(scope);
            if (_.isObject(result) && _.isFunction(result.then)) {
                return Bluebird.resolve(result)
                    .then(function() {
                        return scope;
                    })
                    .finally(function() {
                        scope.end();
                    });
            }
            else {
                scope.end();
                return scope;
            }
        }
        catch(e) {
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
        let set = temporaries[temporaries.length - 1];
        temporaries.length--;
        free(set);
    }
    return scope;
};

scope.register = function(array) {
    if (temporaries.length && _.isObject(array) && _.isFunction(array.free)) {
        let set = temporaries[temporaries.length - 1];
        set.add(array);
    }
};

scope.result = function(array) {
    if (temporaries.length && _.isObject(array)) {
        let set = temporaries[temporaries.length - 1];
        set.delete(array);
    }
    return scope;
};

function free(arrays) {
    for (let array of arrays.values()) {
        array.free();
    }
}

module.exports = scope;