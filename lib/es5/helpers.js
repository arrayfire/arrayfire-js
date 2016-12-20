'use strict';

var Dim4 = require('./Dim4');
var _ = require('lodash');
var assert = require('assert');
var fastcall = require('fastcall');
var ArrayType = fastcall.ArrayType;
var FloatArray = new ArrayType('float');
var semver = require('semver');

var helpers = exports;

helpers.getHandle = function (array) {
    if (array.handle) {
        return array.handle;
    }
    return array;
};

helpers.toBuffer = function (obj) {
    if (Buffer.isBuffer(obj)) {
        return obj;
    }
    if (_.isArray(obj)) {
        var arr = new FloatArray(obj.length);
        for (var i = 0; i < obj.length; i++) {
            arr.set(i, Number(obj[i]));
        }
        return arr.buffer;
    }
    if (_.isTypedArray(obj)) {
        return _typedArrayToBuffer(obj);
    }
    throw new TypeError('Argument "obj" is not a Buffer.');
};

helpers.typedArrayToBuffer = function (arr) {
    assert(_.isTypedArray(arr), 'Argument "arr" is not a typed array.');

    return _typedArrayToBuffer(arr);
};

function _typedArrayToBuffer(arr) {
    if (arr.byteLength !== arr.buffer.byteLength) {
        return helpers.arrayToBuffer(arr.buffer, arr.byteOffset, arr.byteLength);
    }
    return helpers.arrayToBuffer(arr.buffer);
}

if (semver.gt(process.versions.node, '5.1.0')) {
    helpers.arrayToBuffer = function (arr, byteOffset, length) {
        return Buffer.from(arr, byteOffset, length);
    };
} else {
    helpers.arrayToBuffer = function (arr, byteOffset, length) {
        return new Buffer(arr, byteOffset, length);
    };
}
//# sourceMappingURL=helpers.js.map