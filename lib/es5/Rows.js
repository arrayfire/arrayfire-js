'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rows = function () {
    _createClass(Rows, null, [{
        key: 'define',
        value: function define(af) {
            af.rows = function (firstIndex, lastIndex) {
                return new Rows(firstIndex, lastIndex);
            };
        }
    }]);

    function Rows(firstIndex, lastIndex) {
        _classCallCheck(this, Rows);

        this.firstIndex = firstIndex;
        this.lastIndex = lastIndex;
    }

    return Rows;
}();

module.exports = Rows;
//# sourceMappingURL=Rows.js.map