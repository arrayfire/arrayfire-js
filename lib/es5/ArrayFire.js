'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');
var _ = require('lodash');
var fastcall = require('fastcall');
var Promise = require('bluebird');
var Library = fastcall.Library;
var device = require('./device');
var errors = require('./errors');
var enums = require('./enums');
var unified = require('./unified');
var AFArray = require('./AFArray');
var create = require('./create');
var assert = require('assert');
var typedefs = require('./typedefs');
var Dim4 = require('./Dim4');
var Idx = require('./Idx');
var Seq = require('./Seq');
var Col = require('./Col');
var Cols = require('./Cols');
var Row = require('./Row');
var Rows = require('./Rows');
var ref = fastcall.ref;

var defOptions = {
    async: false,
    chainable: true
};

var span = Symbol('span');

var created = false;

var dtypeMap = null;

var ArrayFire = function () {
    function ArrayFire(options) {
        _classCallCheck(this, ArrayFire);

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

    _createClass(ArrayFire, [{
        key: 'release',
        value: function release() {
            this._lib.release();
            created = false;
        }
    }, {
        key: 'enumToString',
        value: function enumToString(values, value) {
            assert(_.isObject(values), 'Argument "values" is not an object.');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _.keys(values)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    var curr = values[key];
                    if (curr === value) {
                        return key;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            throw new TypeError('Value "' + value + '" not fuond on enum values.');
        }
    }, {
        key: 'getDTypeOfTypedArray',
        value: function getDTypeOfTypedArray(array) {
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
    }, {
        key: 'dtypeToRefType',
        value: function dtypeToRefType(type) {
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
                    throw new TypeError('Argument value "' + type + '" is not a valid dtype.');
            }
        }
    }, {
        key: '_makeFunction',
        value: function _makeFunction(init, call, done) {
            var verify = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            if (_.isPlainObject(init)) {
                var args = init;
                init = args.init || _.noop;
                call = args.call;
                done = args.done;
                verify = args.verify === undefined ? true : args.verify;
            } else if (done === undefined) {
                done = call;
                call = init;
                init = _.noop;
            }

            var Caller = function Caller() {
                init.call(this);
            };

            Caller.prototype.call = call;

            Caller.prototype.done = done || _.noop;

            if (this.options.async) {
                if (this.options.chainable) {
                    Caller.prototype.call = ArrayFire._asChainable(call);
                }
                Caller.prototype.process = function () {
                    var _this = this;

                    return this.call.apply(this, arguments).then(function (result) {
                        if (verify) {
                            errors.verify(result);
                        }
                        return _this.done(result);
                    });
                };
                return function () {
                    var caller = new Caller();
                    return caller.process.apply(caller, arguments);
                };
            } else {
                var _ret = function () {
                    Caller.prototype.process = function () {
                        var result = this.call.apply(this, arguments);
                        if (verify) {
                            errors.verify(result);
                        }
                        return this.done(result);
                    };
                    var caller = new Caller();
                    return {
                        v: function v() {
                            return caller.process.apply(caller, arguments);
                        }
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
        }
    }, {
        key: '_makeLibOptions',
        value: function _makeLibOptions() {
            return {
                callMode: this.options.async ? Library.callMode.async : Library.callMode.sync,
                syncMode: Library.syncMode.lock // TODO: benchmark for this
            };
        }
    }, {
        key: 'scope',
        get: function get() {
            return fastcall.scope;
        }
    }, {
        key: 'span',
        get: function get() {
            return span;
        }
    }, {
        key: 'end',
        get: function get() {
            return -1;
        }
    }, {
        key: 'backend',
        get: function get() {
            return enums.backend;
        }
    }, {
        key: 'dtype',
        get: function get() {
            return enums.dtype;
        }
    }, {
        key: 'source',
        get: function get() {
            return enums.source;
        }
    }], [{
        key: '_asChainable',
        value: function _asChainable(func) {
            return function () {
                var _this2 = this;

                var errs = [];
                return Promise.map(arguments, function (arg, idx) {
                    return Promise.resolve(arg).catch(function (err) {
                        errs.push(err);
                        return null;
                    });
                }).then(function (args) {
                    if (errs.length) {
                        throw new errors.ArrayFireChainedError(errs);
                    }
                    return func.apply(_this2, args);
                });
            };
        }
    }]);

    return ArrayFire;
}();

module.exports = ArrayFire;

function getLibName() {
    var plat = os.platform();
    var isWin = plat === 'win32';
    var isOSX = plat === 'darwin';
    var postfix = '';
    var prefix = '';
    if (isOSX) {
        postfix = '.dynlib';
    } else if (!isWin) {
        postfix = '.so';
    }
    if (!isWin) {
        prefix = 'lib';
    }
    return prefix + 'af' + postfix;
}
//# sourceMappingURL=ArrayFire.js.map