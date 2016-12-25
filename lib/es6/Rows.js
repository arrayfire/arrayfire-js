'use strict';

class Rows {
    static define(af) {
        af.rows = function (firstIndex, lastIndex) {
            return new Rows(firstIndex, lastIndex);
        };
    }

    constructor(firstIndex, lastIndex) {
        this.firstIndex = firstIndex;
        this.lastIndex = lastIndex;
    }
}

module.exports = Rows;