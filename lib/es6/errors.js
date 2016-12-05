'use strict';
const util = require('util');
const assert = require('assert');

exports.AFError = AFError;
exports.AFChainedError = AFChainedError;

function AFError(message, code) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || 'Unknown ArrayFire error.';
    if (code !== undefined) {
        this.code = code;
    }
}

util.inherits(AFError, Error);

function AFChainedError(errors) {
    assert(errors.lenght);

    AFError.call(this, `${ errors[0].message } (More errors captured, refer to "errors" property's value.)`, errors[0].code);
    this.errors = errors;
    this.code = errors[0].code;
}

util.inherits(AFChainedError, AFError);