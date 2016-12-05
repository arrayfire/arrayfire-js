'use strict';
const os = require('os');
const _ = require('lodash');
const fastcall = require('fastcall');
const helpers = require('./helpers');
const device = require('./device');

const defOptions = {
    async: false,
    chainable: true
};

class AF {
    constructor(options) {
        this.options = Object.freeze(_.defaults(options, defOptions));
        this._lib = new fastcall.Library(getLibName(), this._makeLibOptions());

        device(this._lib);

        for (const item of this._lib.interface) {
            if (item.function) {
                this[item.function.name] = this._makeFunction(item);
            }
        }
    }

    _makeFunction(func) {
        if (this.options.async && this.options.chainable) {
            return this.asChainable(func);
        }
        return func;
    }
}

module.exports = AF;

function getLibName() {
    const plat = os.platform();
    const isWin = plat === 'win32';
    const isOSX = plat === 'darwin';
    const postfix = '';
    const prefix = '';
    if (isOSX) {
        postfix = '.dynlib';
    }
    else if (!isWin) {
        postfix = '.so';
    }
    if (!isWin) {
        prefix = 'lib';
    }
    return prefix + 'af' + postfix;
}