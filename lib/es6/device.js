'use strict';
const fastcall = require('fastcall');
const ref = fastcall.ref;
const errors = require('./errors');

module.exports = function (af) {
    const lib = af._lib;
    const intf = lib.interface;

    // deviceInfo

    lib.declare('int af_device_info(CString name, CString platform, CString toolkit, CString compute)');

    const name = new Buffer(512);
    const platform = new Buffer(512);
    const toolkit = new Buffer(512);
    const compute = new Buffer(512);

    af.deviceInfo = af._makeFunction(
        () => {
            name.fill(0);
            platform.fill(0);
            toolkit.fill(0);
            compute.fill(0);
            return intf.af_device_info(name, platform, toolkit, compute);
        },
        result => {
            errors.verify(result);
            return {
                name: ref.readCString(name),
                platform: ref.readCString(platform),
                toolkit: ref.readCString(toolkit),
                compute: ref.readCString(compute),
            };
        });

    // infoString

    if (lib.isSymbolExists('af_info_string')) {
        lib.declare('int af_info_string(CString* result, bool verbose)');

        const infoPtr = ref.alloc('CString');

        return af.infoString = af._makeFunction(
            (verbose = false) => {
                return intf.af_info_string(infoPtr);
            },
            result => {
                errors.verify(result);
                return ref.readCString(infoPtr.deref());
            }
        );
    }
    else {
        af.infoString = af._makeFunction(
            () => af.deviceInfo(),
            info => `name: ${ info.name }, platform: ${ info.platform }, toolkit: ${ info.toolkit }, compute: ${ info.compute }`);
    }

/*
Libdl.dlsym(ptr, :af_get_device_count),
Libdl.dlsym(ptr, :af_set_device),
Libdl.dlsym(ptr, :af_get_device),
Libdl.dlsym(ptr, :af_set_seed),
Libdl.dlsym(ptr, :af_sync)

function getDeviceCount(af::ArrayFire)
    count = Ref{Cint}(0)
    err = ccall(af.device.getDeviceCount, Cint, (Ref{Cint},), count)
    assertErr(err)
    count[]
end

function setDevice(af::ArrayFire, device)
    err = ccall(af.device.setDevice, Cint, (Cint,), device)
    assertErr(err)
end

function getDevice(af::ArrayFire)
    device = Ref{Cint}(0)
    err = ccall(af.device.getDevice, Cint, (Ref{Cint},), device)
    assertErr(err)
    device[]
end

function deviceInfos(af::ArrayFire)
    curr = getDevice(af)
    count = getDeviceCount(af)
    result = Array(DeviceInfo, count)
    try
        for id = 0:(count - 1)
            setDevice(af, id)
            result[id + 1] = deviceInfo(af)
        end
    finally
        setDevice(af, curr)
    end
    result
end

function setSeed(af::ArrayFire, seed)
    err = ccall(af.device.setSeed, Cint, (UInt64,), UInt64(seed))
    assertErr(err)
end

function sync(af::ArrayFire)
    err = ccall(af.device.sync, Cint, (Int32,), getDevice(af))
    assertErr(err)
end
*/
}