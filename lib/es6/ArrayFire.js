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
const create = require('./create');
const assert = require('assert');
const typedefs = require('./typedefs');
const Dim4 = require('./Dim4');
const Idx = require('./Idx');
const Seq = require('./Seq');
const Col = require('./Col');
const Cols = require('./Cols');
const Row = require('./Row');
const Rows = require('./Rows');
const ref = fastcall.ref;

const defOptions = {
    async: false,
    chainable: true
};

const span = Symbol('span');

let created = false;

let dtypeMap = null;

class ArrayFire {
    constructor(options) {
        if (created) {
            throw new Error('Only one instance of ArrayFire class allowed.');
        }

        this.options = Object.freeze(_.defaults(options, defOptions));
        this._lib = new Library(getLibName(), this._makeLibOptions());
        this._batch = false;

        typedefs.define(this);
        Dim4.define(this);
        Idx.define(this);
        Seq.define(this);
        Col.define(this);
        Cols.define(this);
        Row.define(this);
        Rows.define(this);
        device(this);
        unified(this);
        AFArray.define(this);
        create(this);

        created = true;
    }

    release() {
        this._lib.release();
        created = false;
    }

    get scope() {
        return fastcall.scope;
    }

    get span() {
        return span;
    }

    get end() {
        return -1;
    }

    get backend() {
        return enums.backend;
    }

    get dtype() {
        return enums.dtype;
    }

    get source() {
        return enums.source;
    }

    enumToString(values, value) {
        assert(_.isObject(values), 'Argument "values" is not an object.');

        for (const key of _.keys(values)) {
            const curr = values[key];
            if (curr === value) {
                return key;
            }
        }

        throw new TypeError(`Value "${ value }" not fuond on enum values.`);
    }

    getDTypeOfTypedArray(array) {
        if (array instanceof Int8Array) {
            return enums.dtype.u8;
        }
        if (array instanceof Uint8Array) {
            return enums.dtype.u8;
        }
        if (array instanceof Uint8ClampedArray) {
            return enums.dtype.u8;
        }
        if (array instanceof Int16Array) {
            return enums.dtype.s16;
        }
        if (array instanceof Uint16Array) {
            return enums.dtype.u16;
        }
        if (array instanceof Int32Array) {
            return enums.dtype.s32;
        }
        if (array instanceof Uint32Array) {
            return enums.dtype.u32;
        }
        if (array instanceof Float32Array) {
            return enums.dtype.f32;
        }
        if (array instanceof Float64Array) {
            return enums.dtype.f64;
        }
        throw new TypeError('Argument "array" is not a typed array.');
    }

    dtypeToRefType(type) {
        switch (type) {
            case enums.dtype.f32:
                return ref.types.float;
            case enums.dtype.c32:
                throw new Error('Complext types are not supported yet.');
            case enums.dtype.f64:
                return ref.types.double;
            case enums.dtype.c64:
                throw new Error('Complext types are not supported yet.');
            case enums.dtype.b8:
                return ref.types.bool;
            case enums.dtype.s32:
                return ref.types.uint32;
            case enums.dtype.u32:
                return ref.types.uint32;
            case enums.dtype.u8:
                return ref.types.uint8;
            case enums.dtype.s64:
                return ref.types.int64;
            case enums.dtype.u64:
                return ref.types.uint64;
            case enums.dtype.s16:
                return ref.types.int16;
            case enums.dtype.u16:
                return ref.types.uint16;
            default:
                throw new TypeError(`Argument value "${ type }" is not a valid dtype.`);
        }
    }

    _makeFunction(init, call, done, verify = true) {
        if (_.isPlainObject(init)) {
            const args = init;
            init = args.init || _.noop;
            call = args.call;
            done = args.done;
            verify = args.verify === undefined ? true : args.verify;
        }
        else if (done === undefined) {
            done = call;
            call = init;
            init = _.noop;
        }

        const Caller = function () {
            init.call(this);
        };

        Caller.prototype.call = call;

        Caller.prototype.done = done || _.noop;

        if (this.options.async) {
            if (this.options.chainable) {
                Caller.prototype.call = ArrayFire._asChainable(call);
            }
            Caller.prototype.process = function () {
                return this.call.apply(this, arguments)
                .then(result => {
                    if (verify) {
                        errors.verify(result);
                    }
                    return this.done(result);
                });
            };
            return function () {
                const caller = new Caller();
                return caller.process.apply(caller, arguments);
            };
        }
        else {
            Caller.prototype.process = function () {
                const result = this.call.apply(this, arguments);
                if (verify) {
                    errors.verify(result);
                }
                return this.done(result);
            };
            const caller = new Caller();
            return function () {
                return caller.process.apply(caller, arguments);
            };
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