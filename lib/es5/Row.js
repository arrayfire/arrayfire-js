'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Row = function () {
    _createClass(Row, null, [{
        key: 'define',
        value: function define(af) {
            af.row = function (index) {
                return new Row(index);
            };
        }
    }]);

    function Row(index) {
        _classCallCheck(this, Row);

        this.index = index;
    }

    return Row;
}();

module.exports = Row;
//# sourceMappingURL=Row.js.map