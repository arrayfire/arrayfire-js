/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

 * Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

"use strict";

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