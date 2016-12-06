'use strict';
const os = require('os');
const _ = require('lodash');
const fastcall = require('fastcall');
const Library = fastcall.Library;
const helpers = require('./helpers');
const device = require('./device');
const errors = require('./errors');

const defOptions = {
    async: false,
    chainable: true
};

let created = false;

class AF {
    constructor(options) {
        if (created) {
            throw new Error('Only one instance of AF class allowed.');
        }

        this.options = Object.freeze(_.defaults(options, defOptions));
        this._lib = new Library(getLibName(), this._makeLibOptions());

        device(this);

        created = true;
    }

    release() {
        this._lib.release();
        created = false;
    }

    _makeFunction(func, done) {
        done = done || (err => errors.verify(err));
        if (this.options.async) {
            if (this.options.chainable) {
                return function () {
                    return helpers.asChainable(func).apply(null, arguments).then(done);
                };
            }
            return function () {
                return func.apply(null, arguments).then(done);
            };
        }
        return function () {
            return done(func.apply(null, arguments));
        }
    }

    _makeLibOptions() {
        return {
            callMode: this.options.async ? Library.callMode.async : Library.callMode.sync,
            syncMode: Library.syncMode.lock // TODO: benchmark for this
        };
    }
}

module.exports = AF;

function getLibName() {
    const plat = os.platform();
    const isWin = plat === 'win32';
    const isOSX = plat === 'darwin';
    let postfix = '';
    let prefix = '';
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