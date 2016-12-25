'use strict';

class Row {
    static define(af) {
        af.row = function (index) {
            return new Row(index);
        };
    }

    constructor(index) {
        this.index = index;
    }
}

module.exports = Row;