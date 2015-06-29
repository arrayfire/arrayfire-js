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

let matProp = module.exports = {
    none       : 0,    ///< Default
    trans      : 1,    ///< Data needs to be transposed
    cTrans     : 2,    ///< Data needs to be conjugate tansposed
    upper      : 32,   ///< Matrix is upper triangular
    lower      : 64,   ///< Matrix is lower triangular
    diagUnit   : 128,  ///< Matrix diagonal contains unitary values
    sym        : 512,  ///< Matrix is symmetric
    posDef     : 1024, ///< Matrix is positive definite
    orthog     : 2048, ///< Matrix is orthogonal
    triDiag    : 4096, ///< Matrix is tri diagonal
    blockDiag  : 8192,  ///< Matrix is block diagonal
    AF_MAT_NONE       : 0,    ///< Default
    AF_MAT_TRANS      : 1,    ///< Data needs to be transposed
    AF_MAT_CTRANS     : 2,    ///< Data needs to be conjugate tansposed
    AF_MAT_UPPER      : 32,   ///< Matrix is upper triangular
    AF_MAT_LOWER      : 64,   ///< Matrix is lower triangular
    AF_MAT_DIAG_UNIT  : 128,  ///< Matrix diagonal contains unitary values
    AF_MAT_SYM        : 512,  ///< Matrix is symmetric
    AF_MAT_POSDEF     : 1024, ///< Matrix is positive definite
    AF_MAT_ORTHOG     : 2048, ///< Matrix is orthogonal
    AF_MAT_TRI_DIAG   : 4096, ///< Matrix is tri diagonal
    AF_MAT_BLOCK_DIAG : 8192  ///< Matrix is block diagonal
};