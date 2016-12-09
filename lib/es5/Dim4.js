'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var fastcall = require('fastcall');
var ref = fastcall.ref;
var ArrayType = ref.ArrayType;
var DimTArray = new ArrayType('longlong', 4);

var Dim4 = function () {
    _createClass(Dim4, null, [{
        key: 'define',
        value: function define(af) {
            af.dim4 = function () {
                return Reflect.construct(Dim4, arguments);
            };
        }
    }]);

    function Dim4() {
        _classCallCheck(this, Dim4);

        this.data = new DimTArray();
        this.first = 0;
        this.second = 0;
        this.third = 0;
        this.fourth = 0;

        if (arguments.length) {
            var firstArg = arguments[0];

            if (_.isObject(firstArg) || _.isArray(firstArg)) {
                if (firstArg[0] >= 0) {
                    this.first = firstArg[0];
                }
                if (firstArg[1] >= 0) {
                    this.second = firstArg[1];
                }
                if (firstArg[2] >= 0) {
                    this.third = firstArg[2];
                }
                if (firstArg[3] >= 0) {
                    this.fourth = firstArg[3];
                }
            } else {
                if (arguments[0] >= 0) {
                    this.first = arguments[0];
                }
                if (arguments[1] >= 0) {
                    this.second = arguments[1];
                }
                if (arguments[2] >= 0) {
                    this.third = arguments[2];
                }
                if (arguments[3] >= 0) {
                    this.fourth = arguments[3];
                }
            }
        }
    }

    _createClass(Dim4, [{
        key: 'first',
        get: function get() {
            return this.data.get(0);
        },
        set: function set(value) {
            this.data.set(0, value);
        }
    }, {
        key: 'second',
        get: function get() {
            return this.data.get(1);
        },
        set: function set(value) {
            this.data.set(1, value);
        }
    }, {
        key: 'third',
        get: function get() {
            return this.data.get(2);
        },
        set: function set(value) {
            this.data.set(2, value);
        }
    }, {
        key: 'fourth',
        get: function get() {
            return this.data.get(3);
        },
        set: function set(value) {
            this.data.set(3, value);
        }
    }, {
        key: 0,
        get: function get() {
            return this.first;
        },
        set: function set(value) {
            this.first = value;
        }
    }, {
        key: 1,
        get: function get() {
            return this.second;
        },
        set: function set(value) {
            this.second = value;
        }
    }, {
        key: 2,
        get: function get() {
            return this.third;
        },
        set: function set(value) {
            this.third = value;
        }
    }, {
        key: 3,
        get: function get() {
            return this.fourth;
        },
        set: function set(value) {
            this.fourth = value;
        }
    }, {
        key: 'ndims',
        get: function get() {
            if (this.fourth > 0) {
                return 4;
            }
            if (this.third > 0) {
                return 3;
            }
            if (this.second > 0) {
                return 2;
            }
            if (this.first > 0) {
                return 1;
            }
            return 0;
        }
    }, {
        key: 'elements',
        get: function get() {
            if (this.fourth > 0) {
                return this.fourth * this.third * this.second * this.first;
            }
            if (this.third > 0) {
                return this.third * this.second * this.first;
            }
            if (this.second > 0) {
                return this.second * this.first;
            }
            if (this.first > 0) {
                return this.first;
            }
            return 0;
        }
    }]);

    return Dim4;
}();

module.exports = Dim4;
//# sourceMappingURL=Dim4.js.map