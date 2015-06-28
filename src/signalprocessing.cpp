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

#include "ext.h"
#include "computervision.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

//AFAPI array 	convolve (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT, const convDomain domain=AF_CONV_AUTO)
//AFAPI array 	convolve (const array &col_filter, const array &row_filter, const array &signal, const convMode mode=AF_CONV_DEFAULT)
//AFAPI array 	convolve1 (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT, const convDomain domain=AF_CONV_AUTO)
//AFAPI array 	convolve2 (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT, const convDomain domain=AF_CONV_AUTO)
//AFAPI array 	convolve3 (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT, const convDomain domain=AF_CONV_AUTO)

//AFAPI array 	fftConvolve (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT)
//AFAPI array 	fftConvolve2 (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT)
//AFAPI array 	fftConvolve3 (const array &signal, const array &filter, const convMode mode=AF_CONV_DEFAULT)

//AFAPI array 	fftNorm (const array &in, const double norm_factor, const dim_t odim0=0)
//AFAPI array 	fft (const array &in, const dim_t odim0=0)
//AFAPI array 	dft (const array &in, const double norm_factor, const dim4 outDims)
//AFAPI array 	dft (const array &in, const dim4 outDims)
//AFAPI array 	dft (const array &in)
//AFAPI array 	idft (const array &in, const double norm_factor, const dim4 outDims)
//AFAPI array 	idft (const array &in, const dim4 outDims)
//AFAPI array 	idft (const array &in)

//AFAPI array 	fft2Norm (const array &in, const double norm_factor, const dim_t odim0=0, const dim_t odim1=0)
//AFAPI array 	fft2 (const array &in, const dim_t odim0=0, const dim_t odim1=0)

//AFAPI array 	fft3Norm (const array &in, const double norm_factor, const dim_t odim0=0, const dim_t odim1=0, const dim_t odim2=0)
//AFAPI array 	fft3 (const array &in, const dim_t odim0=0, const dim_t odim1=0, const dim_t odim2=0)

//AFAPI array 	ifftNorm (const array &in, const double norm_factor, const dim_t odim0=0)
//AFAPI array 	ifft (const array &in, const dim_t odim0=0)

//AFAPI array 	ifft2Norm (const array &in, const double norm_factor, const dim_t odim0=0, const dim_t odim1=0)
//AFAPI array 	ifft2 (const array &in, const dim_t odim0=0, const dim_t odim1=0)

//AFAPI array 	ifft3Norm (const array &in, const double norm_factor, const dim_t odim0=0, const dim_t odim1=0, const dim_t odim2=0)
//AFAPI array 	ifft3 (const array &in, const dim_t odim0=0, const dim_t odim1=0, const dim_t odim2=0)

//AFAPI array 	fir (const array &b, const array &x)
//AFAPI array 	iir (const array &b, const array &a, const array &x)

//AFAPI array 	approx1 (const array &in, const array &pos, const interpType method=AF_INTERP_LINEAR, const float offGrid=0.0f)

//AFAPI array 	approx2 (const array &in, const array &pos0, const array &pos1, const interpType method=AF_INTERP_LINEAR, const float offGrid=0.0f)

void InitSignalProcessing(v8::Handle<v8::Object> exports)
{
}
