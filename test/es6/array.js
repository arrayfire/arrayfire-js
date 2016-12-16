'use strict';
const Promise = require('bluebird');
const assert = require('assert');
const _ = require('lodash');
const async = Promise.coroutine;
const arrayFireJs = require('../..');
const ArrayFire = arrayFireJs.ArrayFire;

describe('array', function () {
    let af = null;

    beforeEach(function () {
        af = new ArrayFire();
    });

    afterEach(function () {
        if (af) {
            af.release();
            af = null;
        }
    });

    describe('construct', function () {
        describe('sync', function () {
            let arr = [1, 2];
            let afArr = af.array(arr);
            let dims = afArr.dims();
            assert.strictEqual(dims[0], 2);
            assert.strictEqual(dims[1], 1);
            assert.strictEqual(dims[2], 1);
            assert.strictEqual(dims[3], 1);
            assert.strictEqual(dims.elements, 2);
            assert.strictEqual(dims.ndims, 1);
            assert.strictEqual(af.dims(0), 2);
            assert.strictEqual(af.dims(1), 1);
            assert.strictEqual(af.dims(2), 1);
            assert.strictEqual(af.dims(3), 1);
            /*
            arr = [1.0f0, 2.0f0]
            afArr = array(af, arr)
            @test [2, 1, 1, 1] == dims(afArr)
            @test (2,) == size(afArr)
            @test host(afArr) == arr
            @test dType(afArr) == f32
            @test numdims(afArr) == length(size(afArr))

            arr = [1.0f0 2.0f0]
            afArr = array(af, arr)
            @test [1, 2, 1, 1] == dims(afArr)
            @test (1,2) == size(afArr)
            @test host(afArr) == arr
            @test dType(afArr) == f32
            @test numdims(afArr) == length(size(afArr))

            afArr = array(af, Float32, 3)
            @test [3, 1, 1, 1] == dims(afArr)
            @test (3,) == size(afArr)
            arr = host(afArr)
            @test typeof(arr) == Array{Float32, 1}
            @test (3,) == size(arr)
            @test dType(afArr) == f32
            @test numdims(afArr) == length(size(afArr))

            afArr = array(af, Float32, 1, 3)
            @test [1, 3, 1, 1] == dims(afArr)
            @test (1, 3) == size(afArr)
            arr = host(afArr)
            @test typeof(arr) == Array{Float32, 2}
            @test (1, 3) == size(arr)
            @test dType(afArr) == f32
            @test numdims(afArr) == length(size(afArr))

            arr = [1.0f0, 2.0f0]
            afArr = array(af, arr, 1, 2)
            @test [1, 2, 1, 1] == dims(afArr)
            @test (1, 2) == size(afArr)
            @test host(afArr) == [1.0f0 2.0f0]
            @test dType(afArr) == f32
            @test numdims(afArr) == length(size(afArr))

            arr = [one(Int32) zero(Int32)]
            afArr = array(af, arr, 2)
            @test [2, 1, 1, 1] == dims(afArr)
            @test (2, ) == size(afArr)
            @test host(afArr) == [one(Int32), zero(Int32)]
            @test dType(afArr) == s32
            @test numdims(afArr) == length(size(afArr))
            */
        });

        describe('async', function () {
        });
    });
});