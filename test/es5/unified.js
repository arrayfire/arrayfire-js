'use strict';

var Promise = require('bluebird');
var assert = require('assert');
var _ = require('lodash');
var async = Promise.coroutine;
var arrayFireJs = require('../..');
var ArrayFire = arrayFireJs.ArrayFire;

describe('unified backend functions', function () {
    var af = null;

    beforeEach(function () {
        af = new ArrayFire();
    });

    afterEach(function () {
        if (af) {
            af.release();
            af = null;
        }
    });

    it('should give available backends', function () {
        assert(_.isObject(af.backend));
        assert(_.isFunction(af.getAvailableBackends));

        var cpu = af.getAvailableBackends() & af.backend.CPU;
        var cuda = af.getAvailableBackends() & af.backend.CUDA;
        var ocl = af.getAvailableBackends() & af.backend.OPENCL;

        assert(cpu && (cuda || ocl));
        assert.equal(af.getBackendCount(), (cpu && 1) + (cuda && 1) + (ocl && 1));
    });

    it('should switch to other backends', function () {
        var cuda = af.getAvailableBackends() & af.backend.CUDA;
        var ocl = af.getAvailableBackends() & af.backend.OPENCL;

        cuda && tryBackend(af.backend.CUDA);
        ocl && tryBackend(af.backend.OPENCL);
        tryBackend(af.backend.CPU);

        function tryBackend(backend) {
            try {
                af.setBackend(backend);
                assert.strictEqual(af.getActiveBackend(), backend);
            } catch (e) {
                if (e.code === 501) {
                    return;
                }
                if (e.code) {
                    throw Error('Error with backend ' + af.enumToString(af.backend, backend) + ', code: ' + e.code + ', message: ' + e.message);
                }
                throw e;
            }
        }
    });

    it.skip('should give back array\'s backend and device information', function () {
        assert(false, 'TODO');
    });
});
//# sourceMappingURL=unified.js.map