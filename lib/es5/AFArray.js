'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fastcall = require('fastcall');
var ref = fastcall.ref;
var errors = require('./errors');
var assert = require('assert');
var Disposable = fastcall.Disposable;

var handleType = ref.refType('void');

var AFArray = function (_Disposable) {
    _inherits(AFArray, _Disposable);

    _createClass(AFArray, null, [{
        key: 'define',
        value: function define(af) {
            var lib = af._lib;
            var intf = lib.interface;

            // Dims[]

            lib.declare('longlong[] Dims');

            // releaseArray

            lib.declare('int af_release_array(void* arr)');

            af.releaseArray = af._makeFunction(function (array) {
                return intf.af_release_array(getHandle(array));
            });

            // _createHandle

            lib.declare('int af_create_handle(void* arr, uint ndims, Dims[] dims, int type)');

            af._createHandle = af._makeFunction(function () {
                this.dims = lib.arrays.Dims.type(4);
                this.res = ref.alloc(handleType);
            }, function () {
                var dims = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
                var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                var len = 0;
                if (dims) {
                    len = Math.min(4, dims.length);
                    for (var i = 0; i < len; i++) {
                        this.dims.set(i, dims[i]);
                    }
                }
                return intf.af_create_handle(this.res, len, this.dims, type);
            }, function () {
                return this.res.unref();
            });

            /*
            Libdl.dlsym(ptr, :af_create_array),
            Libdl.dlsym(ptr, :af_retain_array),
            Libdl.dlsym(ptr, :af_get_dims),
            Libdl.dlsym(ptr, :af_get_data_ptr),
            Libdl.dlsym(ptr, :af_get_type),
            Libdl.dlsym(ptr, :af_get_numdims),
            Libdl.dlsym(ptr, :af_get_elements),
            Libdl.dlsym(ptr, :af_is_empty),
            Libdl.dlsym(ptr, :af_eval),
            */

            // ctors

            af.array = af._makeFunction(function () {
                var argsLen = arguments.length;

                // array()
                if (argsLen === 0) {
                    return intf._createHandle();
                }
            }, function (handle) {
                return new AFArray(af, handle);
            });
        }
    }]);

    function AFArray(af, handle) {
        _classCallCheck(this, AFArray);

        var _this = _possibleConstructorReturn(this, (AFArray.__proto__ || Object.getPrototypeOf(AFArray)).call(this, function () {
            return af.releaseArray(handle);
        }));

        _this.af = af;
        _this.handle = handle;
        return _this;
    }

    return AFArray;
}(Disposable);

module.exports = AFArray;

// helpers:

function getHandle(array) {
    if (array.handle) {
        return array.handle;
    }
    return array;
}
//# sourceMappingURL=AFArray.js.map