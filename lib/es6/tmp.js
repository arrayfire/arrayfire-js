"use strict";
let Bluebird = require("bluebird");
let _ = require("lodash");

let temporaries = [];

function tmp(f) {
    if (_.isFunction(f)) {
        tmp.begin();
        try {
            let result = f.call(tmp);
            if (_.isObject(result) && _.isFunction(result.then)) {
                return Bluebird.resolve(result)
                    .then(function() {
                        return tmp;
                    })
                    .finally(function() {
                        tmp.end();
                    });
            }
            else {
                tmp.end();
                return tmp;
            }
        }
        catch(e) {
            tmp.end();
            throw e;
        }
    }
}

tmp.begin = function() {
    temporaries.push(new Set());
    return tmp;
};

tmp.end = function() {
    if (temporaries.length) {
        let set = temporaries[temporaries.length - 1];
        temporaries.length--;
        free(set);
    }
    return tmp;
};

tmp.register = function(array) {
    if (temporaries.length && _.isObject(array) && _.isFunction(array.free)) {
        let set = temporaries[temporaries.length - 1];
        set.add(array);
    }
};

tmp.result = function(array) {
    if (temporaries.length && _.isObject(array)) {
        let set = temporaries[temporaries.length - 1];
        set.delete(array);
    }
    return tmp;
};

function free(arrays) {
    for (let array of arrays.values()) {
        array.free();
    }
}

module.exports = tmp;