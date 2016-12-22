'use strict';
const typedefs = require('./typedefs');
const SeqT = typedefs.SeqT;

class Seq {
    static define(af) {
        af.seq = function () {
            return new Seq(...arguments);
        };
    }

    constructor(v1, v2, v3) {
        if (v3 === undefined) {
            if (v2 === undefined) {
                this.data = new SeqT({
                    begin: v1,
                    end: v1,
                    step: 1
                });
            }
            else {
                this.data = new SeqT({
                    begin: v1,
                    end: v2,
                    step: 1
                });
            }
        }
        else {
            this.data = new SeqT({
                begin: v1,
                end: v2,
                step: v3
            });
        }
    }

    get begin() {
        return this.data.begin;
    }

    set begin(value) {
        this.data.begin = value;
    }

    get end() {
        return this.data.end;
    }

    set end(value) {
        this.data.end = value;
    }

    get step() {
        return this.data.step;
    }

    set step(value) {
        this.data.step = value;
    }
}

module.exports = Seq;