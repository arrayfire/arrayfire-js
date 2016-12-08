'use strict';
const os = require('os');
const _ = require('lodash');
const fastcall = require('fastcall');
const Promise = require('bluebird');
const Library = fastcall.Library;
const device = require('./device');
const errors = require('./errors');
const enums = require('./enums');
const unified = require('./unified');
const AFArray = require('./AFArray');

const defOptions = {
    async: false,
    chainable: true
};

let created = false;

class ArrayFire {
    constructor(options) {
        if (created) {
            throw new Error('Only one instance of ArrayFire class allowed.');
        }

        this.options = Object.freeze(_.defaults(options, defOptions));
        this._lib = new Library(getLibName(), this._makeLibOptions());

        device(this);
        unified(this);
        AFArray.define(this);

        created = true;
    }

    release() {
        this._lib.release();
        created = false;
    }

    get backend() {
        return enums.backend;
    }

    get dtype() {
        return enums.dtype;
    }

    _makeFunction(init, call, done) {
        if (done === undefined) {
            done = call;
            call = init;
            init = _.noop;
        }

        const Caller = function () {
            init.call(this);
        };

        Caller.prototype.call = call;

        Caller.prototype.done = 
            done ? 
            function (err) {
                errors.verify(err);
                return done.call(this);
            } :
            function (err) {
                errors.verify(err);
            };

        if (this.options.async) {
            if (this.options.chainable) {
                Caller.prototype.call = ArrayFire._asChainable(call);
            }
            Caller.prototype.process = function () {
                return this.call.apply(this, arguments)
                .then(result => this.done(result));
            }
            return function () {
                const caller = new Caller();
                return caller.process.apply(caller, arguments);
            }
        }
        else {
            Caller.prototype.process = function () {
                const result = this.call.apply(this, arguments);
                return this.done(result);
            }
            const caller = new Caller();
            return function () {
                return caller.process.apply(caller, arguments);
            }
        }
    }

    static _asChainable(func) {
        return function () {
            const errs = [];
            return Promise.map(arguments, (arg, idx) => {
                return Promise.resolve(arg)
                .catch(err => { 
                    errs.push(err);
                    return null;
                });
            })
            .then(args => {
                if (errs.length) {
                    throw new errors.ArrayFireChainedError(errs);
                }
                return func.apply(this, args);
            });
        };
    }

    _makeLibOptions() {
        return {
            callMode: this.options.async ? Library.callMode.async : Library.callMode.sync,
            syncMode: Library.syncMode.lock // TODO: benchmark for this
        };
    }
}

module.exports = ArrayFire;

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