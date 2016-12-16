'use strict';
const Dim4 = require('./Dim4');

const helpers = exports;

helpers.getHandle = function (array) {
    if (array.handle) {
        return array.handle;
    }
    return array;
};

if (Buffer.from) {
    helpers.arrayToBuffer = function (arr) {
        return Buffer.from(arr);
    };
}
else {
    helpers.arrayToBuffer = function (arr) {
        return new Buffer(arr);
    };
}