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
var assert = require('assert');

var defOptions = {
    async: false,
    chainable: true
};

var created = false;

var ArrayFire = function () {
    function ArrayFire(options) {
        _classCallCheck(this, ArrayFire);

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
        key: '_makeFunction',
        value: function _makeFunction(init, call, done) {
            if (done === undefined) {
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
                        errors.verify(result);
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
                        errors.verify(result);
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
        key: 'backend',
        get: function get() {
            return enums.backend;
        }
    }, {
        key: 'dtype',
        get: function get() {
            return enums.dtype;
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