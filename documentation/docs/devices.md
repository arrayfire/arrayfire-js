# Platform and Device managing

[-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__mat.htm)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Selecting Platform](#selecting-platform)
- [getDeviceCount()](#getdevicecount)
- [getDevices()](#getdevices)
- [getDevice()](#getdevice)
- [setDevice()](#setdevice)
- [deviceInfo()](#deviceinfo)
- [isDoubleAvailable()](#isdoubleavailable)
- [sync()](#sync)
- [wait()](#wait)
- [alloc()](#alloc)
- [pinned()](#pinned)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Selecting Platform

Fire.js platform can be selected by calling the root function with the appropriate platform ID as an argument.

Supported platform IDs:

- `CPU` (cpu fallback)
- `OpenCL`
- `CUDA`

**Example:**

```js
var af = require("arrayfire_js");
var cpuPlatform = af("CPU");
```

## getDeviceCount()

Gets the number of devices on the given platform.
 
- `getDeviceCount()`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__count.htm)

**Result: Number** - number of devices

**Example:**

```js
var af = require("arrayfire_js");
var cpuPlatform = af("CPU");
var deviceCount = cpuPlatform.getDeviceCount();
```

## getDevices()

Gets available device descriptors on the given platform.
 
- `getDevices()`

**Result: Array** - array of [device descriptors](#deviceinfo) 

## getDevice()

Get the current device ID. 

- `getDevice()`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__get.htm)

**Result: Number** - current device ID

## setDevice()

Change current device to specified device.

- `setDevice(id)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__set.htm) 

## deviceInfo()

Get the current device's descriptor. 

- `deviceInfo()`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__prop.htm)

**Result: object** - fields

- **name: String** - device's vendor specified name
- **platform: String** - ID of the platform (CPU, OpenCL, CUDA)
- **toolkit: String** - device's vendor specified platform name
- **compute: String** - device's vendor specified version
- **isDoubleAvailable: Boolean** - is double precision supported

## isDoubleAvailable()

Check if double precision support is available for specified device. 

- `isDoubleAvailable(deviceID)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__dbl.htm)

**Argments:**

- **deviceID: Number** - device's ID

**Result: Booean** - is double precision supported

## sync()

asynchronous, counterparts: `syncAsync`, `syncSync`

Waits until all operations on device are finished. 

- `sync()`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__sync.htm)

## wait()

alias of [sync()](#sync)

## alloc()

Allocates memory on the device.

- `alloc(elements, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__alloc.htm)

**Arguments:**

- **elements: Number** - number of elements to allocate
- **type: value of [dType](statics/#typesdtype)** - type of the elements, can be one of the values of dType object (eg. `dType.f32`)

**Result: Buffer** - device memory pointer

**Remarks:** Deallocation is handled by the GC automatically

## pinned()

Allocates pinned memory on the host by using ArrayFire's memory manager.

- `pinned(elements, type)`: [-> ArrayFire Documentation](http://www.arrayfire.com/docs/group__device__func__pinned.htm)

**Arguments:**

- **elements: Number** - number of elements to allocate
- **type: value of [dType](statics/#typesdtype)** - type of the elements, can be one of the values of dType object (eg. `dType.f32`)

**Result: Buffer** - memory pointer

**Remarks:** Deallocation is handled by the GC automatically