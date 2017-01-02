'use strict';
const _ = require('lodash');
const fastcall = require('fastcall');
const assert = require('assert');
const Seq = require('./Seq');
const Col = require('./Col');
const Cols = require('./Cols');
const Row = require('./Row');
const Rows = require('./Rows');
const helpers = require('./helpers');

class Idx {
    static define(af) {
        af.idx = function () {
            return new Idx(af, ...arguments);
        };
    }

    constructor(af, ...args) {
        this.indices = af._lib.arrays.IndexArray.type(4);
        this.ndims = 0;
        this._parseIndexArgs(af, args);
    }

    get buffer() {
        return this.indices.buffer;
    }

    get(idx) {
        return this.indices.get(idx);
    }

    _parseIndexArgs(af, args) {
        const lib = af._lib;
        let i = 0;
        for (; i < args.length; i++) {
            const arg = args[i];
            if (arg instanceof Seq) {
                this.indices.set(i, seqIndex(arg));
            }
            else if (arg === af.span) {
                this.indices.set(i, seqIndex(new Seq(1, 1, 0)));
            }
            else if (_.isNumber(arg)) {
                this.indices.set(i, seqIndex(new Seq(arg)));
            }
            else if (arg instanceof Row) {
                this.indices.set(i++, seqIndex(new Seq(arg.index)));
                this.indices.set(i, seqIndex(new Seq(1, 1, 0)));
            }
            else if (arg instanceof Rows) {
                this.indices.set(i++, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
                this.indices.set(i, seqIndex(new Seq(1, 1, 0)));
            }
            else if (arg instanceof Col) {
                this.indices.set(i++, seqIndex(new Seq(1, 1, 0)));
                this.indices.set(i, seqIndex(new Seq(arg.index)));
            }
            else if (arg instanceof Cols) {
                this.indices.set(i++, seqIndex(new Seq(1, 1, 0)));
                this.indices.set(i, seqIndex(new Seq(arg.firstIndex, arg.lastIndex)));
            }
            else {
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
}

module.exports = Idx;