'use strict';
const Promise = require('bluebird');
const assert = require('assert');
const _ = require('lodash');
const async = Promise.coroutine;
const arrayFire = require('../..');
const ArrayFire = arrayFire.ArrayFire;

describe('unified backend functions', function () {
    let af = null;

    beforeEach(function() {
        af = new ArrayFire();
    });

    afterEach(function () {
        if (af) {
            af.release();
            af = null;
        }
    });

    it('should give available backends', function () {
        assert(_.isObject(af.backends));
        assert(_.isFunction(af.getAvailableBackends));

        const cpu = af.getAvailableBackends() & af.backends.CPU;
        const cuda = af.getAvailableBackends() & af.backends.CUDA;
        const ocl = af.getAvailableBackends() & af.backends.OPENCL;

        assert(cpu && (cuda || ocl));
        assert.equal(af.getBackendCount(), (cpu && 1) + (cuda && 1) + (ocl && 1));
    });

    it('should switch to other backends', function () {
        const cuda = af.getAvailableBackends() & af.backends.CUDA;
        const ocl = af.getAvailableBackends() & af.backends.OPENCL;

        cuda && tryBackend(af.backends.CUDA);
        ocl && tryBackend(af.backends.OPENCL);
        tryBackend(af.backends.CPU);

        function tryBackend(backend) {
            af.setBackend(backend);
            assert.strictEqual(af.getActiveBackend(), backend);
        }
    });

    it.skip(`should give back array's backend and device information`, function () {
        assert(false, 'TODO');
    });
});