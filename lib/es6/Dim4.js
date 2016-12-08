'use strict';
const _ = require('lodash');
const fastcall = require('fastcall');
const ref = fastcall.ref;
const ArrayType = ref.ArrayType;
const DimTArray = new ArrayType('longlong', 4);

class Dim4 {
    static define(af) {
        af.dim4 = function () {
            return Reflect.construct(Dim4, arguments);
        }
    }

    constructor() {
        this.data = new DimTArray(); 
        this.first = 0;
        this.second = 0;
        this.third = 0;
        this.fourth = 0;

        if (arguments.length) {
            const firstArg = arguments[0];

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
            }
            else {
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

    get first() {
        return this.data.get(0);
    }

    set first(value) {
        this.data.set(0, value);
    }

    get second() {
        return this.data.get(1);
    }

    set second(value) {
        this.data.set(1, value);
    }

    get third() {
        return this.data.get(2);
    }

    set third(value) {
        this.data.set(2, value);
    }

    get fourth() {
        return this.data.get(3);
    }

    set fourth(value) {
        this.data.set(3, value);
    }

    get [Symbol(0)]() {
        return this.first;
    }

    set [Symbol(0)](value) {
        this.first = value;
    }

    get [Symbol(1)]() {
        return this.second;
    }

    set [Symbol(1)](value) {
        this.second = value;
    }

    get [Symbol(2)]() {
        return this.third;
    }

    set [Symbol(2)](value) {
        this.third = value;
    }

    get [Symbol(3)]() {
        return this.fourth;
    }

    set [Symbol(3)](value) {
        this.fourth = value;
    }

    get ndims() {
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

    get elements() {
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
}

module.exports = Dim4;