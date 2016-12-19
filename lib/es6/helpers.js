'use strict';
const Dim4 = require('./Dim4');
const _ = require('lodash');
const assert = require('assert');
const fastcall = require('fastcall');
const ArrayType = fastcall.ArrayType;
const FloatArray = new ArrayType('float');

const helpers = exports;

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
        const arr = new FloatArray(obj.length);
        for (let i = 0; i < obj.length; i++) {
            arr.set(i, Number(obj[i]));
        }
        return arr.buffer;
    }
    throw new TypeError('Argument "obj" is not a Buffer.');
};

helpers.typedArrayToBuffer = function (arr) {
    assert(_.isTypedArray(arr), 'Argument "arr" is not a typed array.');

    return _typedArrayToBuffer(arr);
};

function _typedArrayToBuffer(arr) {
    let buffer = helpers.arrayToBuffer(arr.buffer);
    if (arr.byteLength !== arr.buffer.byteLength) {
        buffer = buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
    }
    return buffer;
}

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