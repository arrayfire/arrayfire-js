'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;

module.exports = function (af) {
    const lib = af._lib;
    const intf = lib.interface;

    // getActiveBackend

    lib.declare('int af_get_active_backend(int* backend)');

    af.getActiveBackend = af._makeFunction(
        function () {
            this.res = ref.alloc(ref.types.int);
        },
        function () {
            return intf.af_get_active_backend(this.res);
        },
        function () {
            return this.res.deref();
        });

    // getAvailableBackends

    lib.declare('int af_get_available_backends(int* backend)');

    af.getAvailableBackends = af._makeFunction(
        function () {
            this.res = ref.alloc(ref.types.int);
        },
        function () {
            return intf.af_get_available_backends(this.res);
        },
        function () {
            return this.res.deref();
        });

    // getBackendCount

    lib.declare('int af_get_backend_count(uint* backend)');

    af.getBackendCount = af._makeFunction(
        function () {
            this.res = ref.alloc(ref.types.uint);
        },
        function () {
            return intf.af_get_backend_count(this.res);
        },
        function () {
            return this.res.deref();
        });

    // setBackend

    lib.declare('int af_set_backend(int deviceId)');

    af.setBackend = af._makeFunction(
        function (id) {
            return intf.af_set_backend(id);
        });

    // TODO: getBackendId, getDeviceId for array
};