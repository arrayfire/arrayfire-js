let lodash = require("lodash");
let assert = require("better-assert");

function Dim4(dim0, dim1, dim2, dim3) {
    if (_.isArray(dim0)) {
        return new Dim4(dim0[0], dim0[1], dim0[2], dim0[3]);
    }
    this.dims = [];
    if (_.isNumber(dim0)) { this.dims.push(dim0) } else { this.dims.push(1); }
    if (_.isNumber(dim1)) { this.dims.push(dim1) } else { this.dims.push(1); }
    if (_.isNumber(dim2)) { this.dims.push(dim2) } else { this.dims.push(1); }
    if (_.isNumber(dim3)) { this.dims.push(dim3) } else { this.dims.push(1); }
    let index;
    for (index = 3; index >= 0; index--) {
        if (this.dims[index] !== 1) {
            break;
        }
    }
    this.ndims = this.nDims = index + 1;
    this.elements = this.dims[0] * this.dims[1] * this.dims[2] * this.dims[3];
}

module.exports = Dim4;