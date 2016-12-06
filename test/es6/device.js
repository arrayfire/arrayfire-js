'use strict';
const Promise = require('bluebird');
const assert = require('assert');
const _ = require('lodash');
const async = Promise.coroutine;
const arrayFire = require('../..');
const AF = arrayFire.AF;

describe('device functions', function () {
    let af = null;

    afterEach(function () {
        if (af) {
            af.release();
            af = null;
        }
    });

    it('should give result for deviceInfo (sync)', function () {
        af = new AF();
        assert(_.isFunction(af.deviceInfo));
        const info = af.deviceInfo();
        assert(_.isPlainObject(info));
        assert(_.isString(info.name) && info.name.length);
        assert(_.isString(info.platform) && info.platform.length);
        assert(_.isString(info.toolkit) && info.toolkit.length);
        assert(_.isString(info.compute) && info.compute.length);
    });

    it('should give result for deviceInfo (async)', async(function* () {
        af = new AF({ async: true });
        assert(_.isFunction(af.deviceInfo));
        const info = yield af.deviceInfo();
        assert(_.isPlainObject(info));
        assert(_.isString(info.name) && info.name.length);
        assert(_.isString(info.platform) && info.platform.length);
        assert(_.isString(info.toolkit) && info.toolkit.length);
        assert(_.isString(info.compute) && info.compute.length);
    }));

    it('should give result for infoString', function () {
        af = new AF();
        assert(_.isFunction(af.infoString));
        const info = af.infoString();
        assert(_.isString(info) && info.length);
        const vInfo = af.infoString(true);
        assert(_.isString(vInfo) && vInfo.length);
        assert(vInfo.length >= info.length);
    });
});