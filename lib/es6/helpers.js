'use strict';
const Dim4 = require('./Dim4');

const helpers = exports;

helpers.getHandle = function (array) {
    if (array.handle) {
        return array.handle;
    }
    return array;
};

helpers.parseDims = function (args, fromIndex, outNext) {
    const curr = args[fromIndex];

    if (curr instanceof Dim4) {
        return curr;
    }
    else if (_.isObject(curr) || _.isArray(curr)) {
        return new Dim4(curr);
    }

    const newArgs = [0, 0, 0, 0];
    let index = fromIndex;
    for (let i = 0; i < 4; i++, index++) {
        const arg = args[index];
        if (!_.isNumber(arg)) {
            break;
        }
        newArgs[i] = arg;
    }

    const result = new Dim4(newArgs);
    assert(result.ndims > 0, 'Invalid or missing dimension arguments.');

    outNext && (outNext.value = index);

    return result;
};