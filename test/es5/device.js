'use strict';

var Promise = require('bluebird');
var assert = require('assert');
var _ = require('lodash');
var async = Promise.coroutine;
var arrayFire = require('../..');
var ArrayFire = arrayFire.ArrayFire;

describe('device functions', function () {
    var af = null;

    afterEach(function () {
        if (af) {
            af.release();
            af = null;
        }
    });

    it('should give result for deviceInfo (sync)', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.deviceInfo));
        var name = {};
        var platform = {};
        var toolkit = {};
        var compute = {};
        af.deviceInfo(name, platform, toolkit, compute);
        assert(_.isString(name.value) && name.value.length);
        assert(_.isString(platform.value) && platform.value.length);
        assert(_.isString(toolkit.value) && toolkit.value.length);
        assert(_.isString(compute.value) && compute.value.length);
    });

    it('should give result for deviceInfo (async)', async(regeneratorRuntime.mark(function _callee() {
        var name, platform, toolkit, compute;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        af = new ArrayFire({ async: true });
                        assert(_.isFunction(af.deviceInfo));
                        name = {};
                        platform = {};
                        toolkit = {};
                        compute = {};
                        _context.next = 8;
                        return af.deviceInfo(name, platform, toolkit, compute);

                    case 8:
                        assert(_.isString(name.value) && name.value.length);
                        assert(_.isString(platform.value) && platform.value.length);
                        assert(_.isString(toolkit.value) && toolkit.value.length);
                        assert(_.isString(compute.value) && compute.value.length);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    })));

    it('should give result for infoString (sync)', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.infoString));
        var info = af.infoString();
        assert(_.isString(info) && info.length);
        var vInfo = af.infoString(true);
        assert(_.isString(vInfo) && vInfo.length);
        assert(vInfo.length >= info.length);
    });

    it('should give result for infoString (async)', async(regeneratorRuntime.mark(function _callee2() {
        var info, vInfo;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        af = new ArrayFire({ async: true });
                        assert(_.isFunction(af.infoString));
                        _context2.next = 4;
                        return af.infoString();

                    case 4:
                        info = _context2.sent;

                        assert(_.isString(info) && info.length);
                        _context2.next = 8;
                        return af.infoString(true);

                    case 8:
                        vInfo = _context2.sent;

                        assert(_.isString(vInfo) && vInfo.length);
                        assert(vInfo.length >= info.length);

                    case 11:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    })));

    it('should report device count (sync)', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.getDeviceCount));
        var count = af.getDeviceCount();
        assert(count > 0 && count < 10);
    });

    it('should report device count (async)', async(regeneratorRuntime.mark(function _callee3() {
        var count;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        af = new ArrayFire({ async: true });
                        assert(_.isFunction(af.getDeviceCount));
                        _context3.next = 4;
                        return af.getDeviceCount();

                    case 4:
                        count = _context3.sent;

                        assert(count > 0 && count < 10);

                    case 6:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    })));

    it('should set and get device ids (sync)', function () {
        af = new ArrayFire();
        var count = af.getDeviceCount();
        assert(count > 0 && count < 10);
        assert(_.isFunction(af.getDevice));
        assert(_.isFunction(af.setDevice));
        assert(_.isFunction(af.sync));
        for (var id = count - 1; id >= 0; id--) {
            af.setDevice(id);
            assert.strictEqual(af.getDevice(), id);
            af.sync(id);
            af.sync(); // -1 = current
        }
    });

    it('should set and get device ids (async)', async(regeneratorRuntime.mark(function _callee4() {
        var count, id;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        af = new ArrayFire({ async: true });
                        _context4.next = 3;
                        return af.getDeviceCount();

                    case 3:
                        count = _context4.sent;

                        assert(count > 0 && count < 10);
                        assert(_.isFunction(af.getDevice));
                        assert(_.isFunction(af.setDevice));
                        assert(_.isFunction(af.sync));
                        id = count - 1;

                    case 9:
                        if (!(id >= 0)) {
                            _context4.next = 25;
                            break;
                        }

                        _context4.next = 12;
                        return af.setDevice(id);

                    case 12:
                        _context4.t0 = assert;
                        _context4.next = 15;
                        return af.getDevice();

                    case 15:
                        _context4.t1 = _context4.sent;
                        _context4.t2 = id;

                        _context4.t0.strictEqual.call(_context4.t0, _context4.t1, _context4.t2);

                        _context4.next = 20;
                        return af.sync(id);

                    case 20:
                        _context4.next = 22;
                        return af.sync();

                    case 22:
                        id--;
                        _context4.next = 9;
                        break;

                    case 25:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    })));

    it('should set seed', function () {
        af = new ArrayFire();
        assert(_.isFunction(af.setSeed));
        af.setSeed(42);
    });
});
//# sourceMappingURL=device.js.map