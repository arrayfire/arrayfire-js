'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;

module.exports = function (af) {
    const lib = af._lib;
    const intf = lib.interface;

    // deviceInfo

    lib.declare('int af_device_info(CString name, CString platform, CString toolkit, CString compute)');

    af.deviceInfo = af._makeFunction(
        function () {
            this.name = new Buffer(512);
            this.platform = new Buffer(512);
            this.toolkit = new Buffer(512);
            this.compute = new Buffer(512);
        },
        function (name, platform, toolkit, compute) {
            this.outName = name;
            this.outPlatform = platform;
            this.outToolkit = toolkit;
            this.outCompute = compute;

            this.name.fill(0);
            this.platform.fill(0);
            this.toolkit.fill(0);
            this.compute.fill(0);

            return intf.af_device_info(this.name, this.platform, this.toolkit, this.compute);
        },
        function () {
            this.outName && (this.outName.value = ref.readCString(this.name));
            this.outPlatform && (this.outPlatform.value = ref.readCString(this.platform));
            this.outToolkit && (this.outToolkit.value = ref.readCString(this.toolkit));
            this.outCompute && (this.outCompute.value = ref.readCString(this.compute));
        });

    // infoString

    if (lib.isSymbolExists('af_info_string')) {
        lib.declare('int af_info_string(char** result, bool verbose)');

        af.infoString = af._makeFunction(
            function () {
                this.infoPtr = ref.alloc('char*');
            },
            function (verbose = false) {
                return intf.af_info_string(this.infoPtr);
            },
            function () {
                return ref.readCString(this.infoPtr.deref());
            }
        );
    }
    else {
        af.infoString = af._makeFunction(
            function () {
                this.outName = { value: null };
                this.outPlatform = { value: null };
                this.outToolkit = { value: null };
                this.outCompute = { value: null };
            },
            function () {
                return af.deviceInfo(this.outName, this.outPlatform, this.outToolkit, this.outCompute);
            },
            function () {
                return `name: ${ this.outName.value }, ' +
                    'platform: ${ this.outPlatform.value }, ' +
                    'toolkit: ${ this.outToolkit.value }, ' + 
                    'compute: ${ this.outCompute.value }`;
            });
    }

    // getDeviceCount

    lib.declare('int af_get_device_count(int* id)');

    af.getDeviceCount = af._makeFunction(
        function () {
            this.res = ref.alloc(ref.types.int);
        },
        function () {
            return intf.af_get_device_count(this.res);
        },
        function () {
            return this.res.deref();
        });

    // setDevice

    lib.declare('int af_set_device(int id)');

    af.setDevice = af._makeFunction(
        function (id) {
            return intf.af_set_device(id);
        });

    // getDevice

    lib.declare('int af_get_device(int* id)');

    af.getDevice = af._makeFunction(
        function () {
            this.res = ref.alloc(ref.types.int);
        },
        function () {
            return intf.af_get_device(this.res);
        },
        function () {
            return this.res.deref();
        });

    // setSeed

    lib.declare('int af_set_seed(uint64 seed)');

    af.setSeed = af._makeFunction(
        function (seed) {
            return intf.af_set_seed(seed);
        });

    // sync

    lib.declare('int af_sync(int deviceId)');

    af.sync = af._makeFunction(
        function (deviceId = -1) {
            return intf.af_sync(deviceId);
        });
}