'use strict';

class Col {
    static define(af) {
        af.col = function (index) {
            return new Col(index);
        };
    }

    constructor(index) {
        this.index = index;
    }
}

module.exports = Col;