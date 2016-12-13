'use strict';

class Cols {
    static define(af) {
        af.cols = function (firstIndex, lastIndex) {
            return new Cols(firstIndex, lastIndex);
        }
    }

    constructor(firstIndex, lastIndex) {
        this.firstIndex = firstIndex;
        this.lastIndex = lastIndex;
    }
}

module.exports = Cols;