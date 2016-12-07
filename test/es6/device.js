'use strict';
const Promise = require('bluebird');
const assert = require('assert');
const _ = require('lodash');
const async = Promise.coroutine;
const arrayFire = require('../..');
const ArrayFire = arrayFire.ArrayFire;

describe('device functions', function () {
    let af = null;

    afterEach(function () {
        if (af) {
            af.release();
            af = null;
        }
    });

    it('should give result for deviceInfo (sync)', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.deviceInfo));
        const name = {};
        const platform = {};
        const toolkit = {};
        const compute = {};
        af.deviceInfo(name, platform, toolkit, compute);
        assert(_.isString(name.value) && name.value.length);
        assert(_.isString(platform.value) && platform.value.length);
        assert(_.isString(toolkit.value) && toolkit.value.length);
        assert(_.isString(compute.value) && compute.value.length);
    });

    it('should give result for deviceInfo (async)', async(function* () {
        af = new ArrayFire({ async: true });
        assert(_.isFunction(af.deviceInfo));
        const name = {};
        const platform = {};
        const toolkit = {};
        const compute = {};
        yield af.deviceInfo(name, platform, toolkit, compute);
        assert(_.isString(name.value) && name.value.length);
        assert(_.isString(platform.value) && platform.value.length);
        assert(_.isString(toolkit.value) && toolkit.value.length);
        assert(_.isString(compute.value) && compute.value.length);
    }));

    it('should give result for infoString (sync)', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.infoString));
        const info = af.infoString();
        assert(_.isString(info) && info.length);
        const vInfo = af.infoString(true);
        assert(_.isString(vInfo) && vInfo.length);
        assert(vInfo.length >= info.length);
    });

    it('should give result for infoString (async)', async(function* () {
        af = new ArrayFire({ async: true });
        assert(_.isFunction(af.infoString));
        const info = yield af.infoString();
        assert(_.isString(info) && info.length);
        const vInfo = yield af.infoString(true);
        assert(_.isString(vInfo) && vInfo.length);
        assert(vInfo.length >= info.length);
    }));

    it('should report device count (sync)', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.getDeviceCount));
        const count = af.getDeviceCount();
        assert(count > 0 && count < 10);
    });

    it('should report device count (async)', async(function* () {
        af = new ArrayFire({ async: true });
        assert(_.isFunction(af.getDeviceCount));
        const count = yield af.getDeviceCount();
        assert(count > 0 && count < 10);
    }));

    it('should set and get device ids (sync)', function () {
        af = new ArrayFire();
        const count = af.getDeviceCount();
        assert(count > 0 && count < 10);
        assert(_.isFunction(af.getDevice));
        assert(_.isFunction(af.setDevice));
        assert(_.isFunction(af.sync));
        for (let id = count - 1; id >= 0; id--) {
            af.setDevice(id);
            assert.strictEqual(af.getDevice(), id);
            af.sync(id);
            af.sync(); // -1 = current
        }
    });

    it('should set and get device ids (async)', async(function* () {
        af = new ArrayFire({ async: true });
        const count = yield af.getDeviceCount();
        assert(count > 0 && count < 10);
        assert(_.isFunction(af.getDevice));
        assert(_.isFunction(af.setDevice));
        assert(_.isFunction(af.sync));
        for (let id = count - 1; id >= 0; id--) {
            yield af.setDevice(id);
            assert.strictEqual(yield af.getDevice(), id);
            yield af.sync(id);
            yield af.sync(); // -1 = current
        }
    }));

    it('should set seed', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.setSeed));
        af.setSeed(42);
    });
});