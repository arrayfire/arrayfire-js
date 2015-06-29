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

let normType = module.exports = {
    vector1: 1,      ///< treats the input as a vector and returns the sum of absolute values
    vectorInf: 2,    ///< treats the input as a vector and returns the max of absolute values
    vector2: 3,      ///< treats the input as a vector and returns euclidean norm
    vectorP: 4,      ///< treats the input as a vector and returns the p-norm
    matrix1: 5,      ///< return the max of column sums
    matrixInf: 6,    ///< return the max of row sums
    matrix2: 7,      ///< returns the max singular value). Currently NOT SUPPORTED
    matrixLPq: 8,   ///< returns Lpq-norm
    euclid: 3, ///< The default. Same as vector2
    AF_NORM_VECTOR_1: 1,      ///< treats the input as a vector and returns the sum of absolute values
    AF_NORM_VECTOR_INF: 2,    ///< treats the input as a vector and returns the max of absolute values
    AF_NORM_VECTOR_2: 3,      ///< treats the input as a vector and returns euclidean norm
    AF_NORM_VECTOR_P: 4,      ///< treats the input as a vector and returns the p-norm
    AF_NORM_MATRIX_1: 5,      ///< return the max of column sums
    AF_NORM_MATRIX_INF: 6,    ///< return the max of row sums
    AF_NORM_MATRIX_2: 7,      ///< returns the max singular value). Currently NOT SUPPORTED
    AF_NORM_MATRIX_L_PQ: 8,   ///< returns Lpq-norm
    AF_NORM_EUCLID: 3 ///< The default. Same as AF_NORM_VECTOR_2
};