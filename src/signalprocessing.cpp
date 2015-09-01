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

NAN_METHOD(ConvolveSeparable)
{

    try
    {
        ARGS_LEN(3);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        auto pArray3 = ArrayWrapper::GetArrayAt(info, 2);
        af::convMode mode = AF_CONV_DEFAULT;
        if (info.Length() > 3) mode = (af::convMode)info[3]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::convolve(*pArray1, *pArray2, *pArray3, mode));
    }
    ARRAYFIRE_CATCH;
}

#define ARRAYFIRE_CONVOLVE(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);\
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);\
        af::convMode mode = AF_CONV_DEFAULT;\
        af::convDomain domain = AF_CONV_AUTO;\
        if (info.Length() > 2) mode = (af::convMode)info[2]->Uint32Value();\
        if (info.Length() > 3) domain = (af::convDomain)info[3]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray1, *pArray2, mode, domain));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_CONVOLVE(Convolve, convolve)
ARRAYFIRE_CONVOLVE(Convolve1, convolve1)
ARRAYFIRE_CONVOLVE(Convolve2, convolve2)
ARRAYFIRE_CONVOLVE(Convolve3, convolve3)

#undef ARRAYFIRE_CONVOLVE
#define ARRAYFIRE_CONVOLVE(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);\
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);\
        af::convMode mode = AF_CONV_DEFAULT;\
        if (info.Length() > 2) mode = (af::convMode)info[2]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray1, *pArray2, mode));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_CONVOLVE(FFTConvolve, fftConvolve)
ARRAYFIRE_CONVOLVE(FFTConvolve2, fftConvolve2)
ARRAYFIRE_CONVOLVE(FFTConvolve3, fftConvolve3)
#undef ARRAYFIRE_CONVOLVE

#define ARRAY_FIRE_FFTNORM(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        double factor = info[1]->NumberValue();\
        dim_t odim0 = 0;\
        if (info.Length() > 2) odim0 = info[2]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, factor, odim0));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAY_FIRE_FFTNORM(FFTNorm, fftNorm)
ARRAY_FIRE_FFTNORM(IFFTNorm, ifftNorm)
#undef ARRAY_FIRE_FFTNORM

#define ARRAY_FIRE_FFT(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        dim_t odim0 = 0;\
        if (info.Length() > 1) odim0 = info[1]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, odim0));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAY_FIRE_FFT(FFT, fft)
ARRAY_FIRE_FFT(IFFT, ifft)
#undef ARRAY_FIRE_FFT

#define ARRAYFIRE_DFT(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(1);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        if (info.Length() == 1)\
        {\
            Guard guard;\
            ArrayWrapper::New(af::f(*pArray));\
        }\
        else if (info.Length() == 2)\
        {\
            Guard guard;\
            ArrayWrapper::New(af::f(*pArray, ToDim4(info[1])));\
        }\
        else if (info.Length() == 3)\
        {\
            Guard guard;\
            ArrayWrapper::New(af::f(*pArray, info[1]->NumberValue(), ToDim4(info[2])));\
        }\
        else \
        {\
            NAN_THROW_INVALID_NO_OF_ARGS();\
        }\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_DFT(DFT, dft)
ARRAYFIRE_DFT(IDFT, idft)
#undef ARRAYFIRE_DFT

#define ARRAYFIRE_FFT2(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(1);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        dim_t dim0 = 0;\
        dim_t dim1 = 0;\
        if (info.Length() > 1) dim0 = info[1]->Uint32Value();\
        if (info.Length() > 2) dim1 = info[2]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, dim0, dim1));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_FFT2(FFT2, fft2)
ARRAYFIRE_FFT2(IFFT2, ifft2)
#undef ARRAYFIRE_FFT2

#define ARRAYFIRE_FFT3(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(1);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        dim_t dim0 = 0;\
        dim_t dim1 = 0;\
        dim_t dim2 = 0;\
        if (info.Length() > 1) dim0 = info[1]->Uint32Value();\
        if (info.Length() > 2) dim1 = info[2]->Uint32Value();\
        if (info.Length() > 3) dim2 = info[3]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, dim0, dim1, dim2));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_FFT3(FFT3, fft3)
ARRAYFIRE_FFT3(IFFT3, ifft3)
#undef ARRAYFIRE_FFT3

#define ARRAYFIRE_FFT2NORM(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        double factor = info[1]->NumberValue();\
        dim_t dim0 = 0;\
        dim_t dim1 = 0;\
        if (info.Length() > 2) dim0 = info[2]->Uint32Value();\
        if (info.Length() > 3) dim1 = info[3]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, factor, dim0, dim1));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_FFT2NORM(FFT2Norm, fft2Norm)
ARRAYFIRE_FFT2NORM(IFFT2Norm, ifft2Norm)
#undef ARRAYFIRE_FFT2NORM

#define ARRAYFIRE_FFT3NORM(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        double factor = info[1]->NumberValue();\
        dim_t dim0 = 0;\
        dim_t dim1 = 0;\
        dim_t dim2 = 0;\
        if (info.Length() > 2) dim0 = info[2]->Uint32Value();\
        if (info.Length() > 3) dim1 = info[3]->Uint32Value();\
        if (info.Length() > 4) dim2 = info[4]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, factor, dim0, dim1, dim2));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_FFT3NORM(FFT3Norm, fft3Norm)
ARRAYFIRE_FFT3NORM(IFFT3Norm, ifft3Norm)
#undef ARRAYFIRE_FFT3NORM


ARRAYFIRE_SYNC_METHOD_ARR_ARR(FIR, fir)
ARRAYFIRE_SYNC_METHOD_ARR_ARR_ARR(IIR, iir)

NAN_METHOD(Approx1)
{

    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        af::interpType method = AF_INTERP_LINEAR;
        float offGrid = 0.0f;
        if (info.Length() > 2) method = (af::interpType)info[2]->Uint32Value();
        if (info.Length() > 3) offGrid = info[3]->NumberValue();
        Guard guard;
        ArrayWrapper::New(af::approx1(*pArray1, *pArray2, method, offGrid));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Approx2)
{

    try
    {
        ARGS_LEN(3);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        auto pArray3 = ArrayWrapper::GetArrayAt(info, 2);
        af::interpType method = AF_INTERP_LINEAR;
        float offGrid = 0.0f;
        if (info.Length() > 3) method = (af::interpType)info[3]->Uint32Value();
        if (info.Length() > 4) offGrid = info[4]->NumberValue();
        Guard guard;
        ArrayWrapper::New(af::approx2(*pArray1, *pArray2, *pArray3, method, offGrid));
    }
    ARRAYFIRE_CATCH;
}

NAN_MODULE_INIT(InitSignalProcessing)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("convolveSeparable").ToLocalChecked(), Nan::New<FunctionTemplate>(ConvolveSeparable)->GetFunction());
    Nan::Set(target, Nan::New<String>("convolve").ToLocalChecked(), Nan::New<FunctionTemplate>(Convolve)->GetFunction());
    Nan::Set(target, Nan::New<String>("convolve1").ToLocalChecked(), Nan::New<FunctionTemplate>(Convolve1)->GetFunction());
    Nan::Set(target, Nan::New<String>("convolve2").ToLocalChecked(), Nan::New<FunctionTemplate>(Convolve2)->GetFunction());
    Nan::Set(target, Nan::New<String>("convolve3").ToLocalChecked(), Nan::New<FunctionTemplate>(Convolve3)->GetFunction());
    Nan::Set(target, Nan::New<String>("fftConvolve").ToLocalChecked(), Nan::New<FunctionTemplate>(FFTConvolve)->GetFunction());
    Nan::Set(target, Nan::New<String>("fftConvolve2").ToLocalChecked(), Nan::New<FunctionTemplate>(FFTConvolve2)->GetFunction());
    Nan::Set(target, Nan::New<String>("fftConvolve3").ToLocalChecked(), Nan::New<FunctionTemplate>(FFTConvolve3)->GetFunction());
    Nan::Set(target, Nan::New<String>("fftNorm").ToLocalChecked(), Nan::New<FunctionTemplate>(FFTNorm)->GetFunction());
    Nan::Set(target, Nan::New<String>("iFFTNorm").ToLocalChecked(), Nan::New<FunctionTemplate>(IFFTNorm)->GetFunction());
    Nan::Set(target, Nan::New<String>("fft").ToLocalChecked(), Nan::New<FunctionTemplate>(FFT)->GetFunction());
    Nan::Set(target, Nan::New<String>("iFFT").ToLocalChecked(), Nan::New<FunctionTemplate>(IFFT)->GetFunction());
    Nan::Set(target, Nan::New<String>("dFT").ToLocalChecked(), Nan::New<FunctionTemplate>(DFT)->GetFunction());
    Nan::Set(target, Nan::New<String>("iDFT").ToLocalChecked(), Nan::New<FunctionTemplate>(IDFT)->GetFunction());
    Nan::Set(target, Nan::New<String>("fft2").ToLocalChecked(), Nan::New<FunctionTemplate>(FFT2)->GetFunction());
    Nan::Set(target, Nan::New<String>("iFFT2").ToLocalChecked(), Nan::New<FunctionTemplate>(IFFT2)->GetFunction());
    Nan::Set(target, Nan::New<String>("fft3").ToLocalChecked(), Nan::New<FunctionTemplate>(FFT3)->GetFunction());
    Nan::Set(target, Nan::New<String>("iFFT3").ToLocalChecked(), Nan::New<FunctionTemplate>(IFFT3)->GetFunction());
    Nan::Set(target, Nan::New<String>("fft2Norm").ToLocalChecked(), Nan::New<FunctionTemplate>(FFT2Norm)->GetFunction());
    Nan::Set(target, Nan::New<String>("iFFT2Norm").ToLocalChecked(), Nan::New<FunctionTemplate>(IFFT2Norm)->GetFunction());
    Nan::Set(target, Nan::New<String>("fft3Norm").ToLocalChecked(), Nan::New<FunctionTemplate>(FFT3Norm)->GetFunction());
    Nan::Set(target, Nan::New<String>("iFFT3Norm").ToLocalChecked(), Nan::New<FunctionTemplate>(IFFT3Norm)->GetFunction());
    Nan::Set(target, Nan::New<String>("fir").ToLocalChecked(), Nan::New<FunctionTemplate>(FIR)->GetFunction());
    Nan::Set(target, Nan::New<String>("iir").ToLocalChecked(), Nan::New<FunctionTemplate>(IIR)->GetFunction());
    Nan::Set(target, Nan::New<String>("approx1").ToLocalChecked(), Nan::New<FunctionTemplate>(Approx1)->GetFunction());
    Nan::Set(target, Nan::New<String>("approx2").ToLocalChecked(), Nan::New<FunctionTemplate>(Approx2)->GetFunction());
}
