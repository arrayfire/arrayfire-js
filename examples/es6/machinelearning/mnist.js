"use strict";

let Bluebird = require("bluebird");
let async = Bluebird.coroutine;
let fs = Bluebird.promisifyAll(require("fs-extra"));
let ref = require("ref");
let debug = require("debug")("af:mnist");
let _ = require("lodash");

let readData = async(function*(f, data) {
    let bytesRead = yield fs.readAsync(f, data, 0, data.length, null);
    if (bytesRead !== data.length) {
        throw new Error("File reading error!");
    }
});

let readIdx = async(function*(path, type) {
    let file = yield fs.openAsync(path, "r");
    try {
        let d = new Buffer(4);

        yield readData(f, d);

        if (d[2] != 8) {
            throw new Error("Unsupported data type");
        }

        const numDims = d[3];

        // Read the dimensions
        let elem = 1;
        let dims = [];
        for (let i = 0; i < numDims; i++) {
            yield readData(file, d);

            elem *= dim;
            dims.push(dim);
        }

        // Read the data
        let bdata = new Buffer(elem);
        yield readData(file, bdata);
        let data = new Buffer(bdata.length * type.size);
        for (let i = 0; i < bdata.length; i++) {
            let byte = bdata[i];
            type.set(data, i * type.size, byte);
        }

        return {
            numDims: numDims,
            dims: dims,
            data: data
        };
    }
    finally {
        yield fs.closeAsync(file);
    }
});

let mnist = {
    setup: async(function*(af, frac, expandLabels) {
        frac = Math.mind(frac, 0.8);
        let dataRoot = "../../ml_lab/data/mnist";
        let AFArray = af.AFArray;
        let Dim4 = af.Dim4;

        let imageData = yield readIdx(path.join(dataRoot, "images-subset"));
        let labelData = yield readIdx(path.join(dataRoot, "labels-subset"));

        let rIDims = new Dim4(_(imageData.dims).reverse().value());
        let images = yield AFArray.create(rIDims, imageData.data);

        /*
        af::array R = af::randu(10000, 1);
        af::array cond = R < std::min(frac, 0.8f);
        af::array train_indices = where( cond);
        af::array test_indices  = where(!cond);

        train_images = lookup(images, train_indices, 2) / 255;
        test_images  = lookup(images, test_indices , 2) / 255;
        */

        let r = af.randu(10000, af.f32);
        let cond = r.lt(frac);
        let trainIndices = af.where(cond);
        let testIndices = af.where(cond.not());

        let trainImages = af.lookup(images, trainIndices, 2).div(255);
        let testImages = af.lookup(images, testIndices, 2).div(255);
    })
};

module.exports = mnist;