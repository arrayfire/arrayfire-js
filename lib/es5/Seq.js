'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var typedefs = require('./typedefs');
var SeqT = typedefs.SeqT;

var Seq = function () {
    _createClass(Seq, null, [{
        key: 'define',
        value: function define(af) {
            af.seq = function () {
                return Reflect.construct(Seq, arguments);
            };
        }
    }]);

    function Seq(v1, v2, v3) {
        _classCallCheck(this, Seq);

        if (v3 === undefined) {
            if (v2 === undefined) {
                this.data = new SeqT({
                    begin: v1,
                    end: v1,
                    step: 1
                });
            } else {
                this.data = new SeqT({
                    begin: v1,
                    end: v2,
                    step: 1
                });
            }
        }
        this.data = new SeqT({
            begin: v1,
            end: v2,
            step: v3
        });
    }

    _createClass(Seq, [{
        key: 'begin',
        get: function get() {
            return this.data.begin;
        },
        set: function set(value) {
            this.data.begin = value;
        }
    }, {
        key: 'end',
        get: function get() {
            return this.data.end;
        },
        set: function set(value) {
            this.data.end = value;
        }
    }, {
        key: 'step',
        get: function get() {
            return this.data.step;
        },
        set: function set(value) {
            this.data.step = value;
        }
    }]);

    return Seq;
}();

module.exports = Seq;
//# sourceMappingURL=Seq.js.map