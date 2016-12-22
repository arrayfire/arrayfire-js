'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var fastcall = require('fastcall');
var assert = require('assert');
var Seq = require('./Seq');
var Col = require('./Col');
var Cols = require('./Cols');
var Row = require('./Row');
var Rows = require('./Rows');
var helpers = require('./helpers');

var Idx = function () {
    _createClass(Idx, null, [{
        key: 'define',
        value: function define(af) {
            af.idx = function () {
                return new (Function.prototype.bind.apply(Idx, [null].concat([af], Array.prototype.slice.call(arguments))))();
            };
        }
    }]);

    function Idx(af) {
        _classCallCheck(this, Idx);

        this.indices = af._lib.arrays.IndexArray.type(4);
        this.ndims = 0;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        this._parseIndexArgs(af, args);
    }

    _createClass(Idx, [{
        key: '_parseIndexArgs',
        value: function _parseIndexArgs(af, args) {
            var lib = af._lib;
            var i = 0;
            for (; i < args.length; i++) {
                var arg = args[i];
                if (arg instanceof Seq) {
                    this.indices.set(i, seqIndex(arg));
                } else if (arg === af.span) {
                    this.indices.set(i, seqIndex(new Seq(1, 1, 0)));
                } else if (_.isNumber(arg)) {
                    this.indices.set(i, seqIndex(new Seq(arg)));
                } else if (arg instanceof Row) {
                    this.indices.set(i++, seqIndex(new Seq(arg.index)));
                    this.indices.set(i, seqIndex(new Seq(1, 1, 0)));
                } else if (arg instanceof Rows) {
                    this.indices.set(i++, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
                    this.indices.set(i, seqIndex(new Seq(1, 1, 0)));
                } else if (arg instanceof Col) {
                    this.indices.set(i++, seqIndex(new Seq(1, 1, 0)));
                    this.indices.set(i, seqIndex(new Seq(arg.index)));
                } else if (arg instanceof Cols) {
                    this.indices.set(i++, seqIndex(new Seq(1, 1, 0)));
                    this.indices.set(i, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
                } else {
                    // AFArray
                    this.indices.set(i, lib.structs.IndexT.type({
                        idx: {
                            arr: helpers.getHandle(arg)
                        },
                        isSeq: false,
                        isBatch: af._batch
                    }));
                }
            }

            assert(i > 0 && i <= 4, 'Invalid index arguments.');
            this.ndims = i;

            function seqIndex(seq) {
                return lib.structs.IndexT.type({
                    idx: {
                        seq: seq.data
                    },
                    isSeq: true,
                    isBatch: af._batch
                });
            }
        }
    }, {
        key: 'buffer',
        get: function get() {
            return this.indices.buffer;
        }
    }]);

    return Idx;
}();

module.exports = Idx;
//# sourceMappingURL=Idx.js.map