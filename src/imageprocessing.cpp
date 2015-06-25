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
#include "imageprocessing.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;
using namespace node;

NAN_METHOD(LoadImage)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        String::Utf8Value str(args[0]);
        string fn(*str);
        bool isColor = false;
        if (args.Length() > 1)
        {
            isColor = args[1]->BooleanValue();
        }
        ArrayWrapper::NewAsync(
                args,
                [=](){ Guard(); return new af::array(af::loadImage(fn.c_str(), isColor)); });
    }
    FIRE_CATCH;
}

NAN_METHOD(SaveImage)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        String::Utf8Value str(args[0]);
        string fn(*str);
        auto array = *ArrayWrapper::GetArrayAt(args, 1);
        auto exec = [=]()
        {
            Guard();
            af::saveImage(fn.c_str(), array);
        };
        auto worker = new Worker<void>(GetCallback(args), move(exec));
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH;
}

NAN_METHOD(ColorSpace)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        auto to = (af::CSpace)args[1]->Uint32Value();
        auto from = (af::CSpace)args[2]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::colorSpace(*pArray, to, from));
    }
    FIRE_CATCH;
}

FIRE_SYNC_METHOD_ARR_FLOAT_FLOAT_FLOAT(Gray2RGB, gray2rgb, 1.0f, 1.0f, 1.0f)
FIRE_SYNC_METHOD_ARR_FLOAT_FLOAT_FLOAT(RGB2Gray, rgb2gray, 0.2126f, 0.7152f, 0.0722f)
FIRE_SYNC_METHOD_ARR(HSV2RGB, hsv2rgb)
FIRE_SYNC_METHOD_ARR(RGB2HSV, rgb2hsv)

NAN_METHOD(Regions)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        af::connectivity conn = AF_CONNECTIVITY_4;
        af::dtype dtype = f32;
        if (args.Length() > 1) conn = (af::connectivity)args[1]->Uint32Value();
        if (args.Length() > 2) dtype = GetDTypeInfo(args[2]).first;
        Guard();
        ArrayWrapper::New(af::regions(*pArray, conn, dtype));
    }
    FIRE_CATCH;
}

NAN_METHOD(Bilateral)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float spatialSigma = args[1]->NumberValue();
        float chromaticSigma = args[2]->NumberValue();
        bool isColor = false;
        if (args.Length() > 3) isColor = args[3]->BooleanValue();
        Guard();
        ArrayWrapper::New(af::bilateral(*pArray, spatialSigma, chromaticSigma, isColor));
    }
    FIRE_CATCH;
}

#define FIRE_FILT_METHOD(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(1);\
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);\
        dim_t windLength = 3;\
        dim_t windWidth = 3;\
        af::borderType edgePad = AF_PAD_ZERO;\
        if (args.Length() > 1) windLength = args[1]->Uint32Value();\
        if (args.Length() > 2) windWidth = args[2]->Uint32Value();\
        if (args.Length() > 3) edgePad = (af::borderType)args[3]->Uint32Value();\
        Guard();\
        ArrayWrapper::New(af::f(*pArray, windLength, windWidth, edgePad));\
    }\
    FIRE_CATCH;\
}

FIRE_FILT_METHOD(MaxFilt, maxfilt)
FIRE_FILT_METHOD(MinFilt, minfilt)
FIRE_FILT_METHOD(MedFilt, medfilt)
#undef FIRE_FILT_METHOD

NAN_METHOD(MeanShift)
{
    NanScope();
    try
    {
        ARGS_LEN(4);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float spatialSigma = args[1]->NumberValue();
        float chromaticSigma = args[2]->NumberValue();
        unsigned iter = args[3]->Uint32Value();
        bool isColor = false;
        if (args.Length() > 4) isColor = args[4]->BooleanValue();
        Guard();
        ArrayWrapper::New(af::meanShift(*pArray, spatialSigma, chromaticSigma, iter, isColor));
    }
    FIRE_CATCH;
}

NAN_METHOD(Sobel)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        unsigned kerSize = 3;
        if (args.Length() > 1) kerSize = args[1]->Uint32Value();
        Guard();
        af::array dx, dy;
        af::sobel(dx, dy, *pArray, kerSize);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::DX), ArrayWrapper::New(dx));
        result->Set(NanNew(Symbols::DY), ArrayWrapper::New(dy));
        NanReturnValue(result);
    }
    FIRE_CATCH;
}

FIRE_SYNC_METHOD_ARR_ARR(HistEqual, histEqual)

NAN_METHOD(Histogram)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        unsigned nbins = args[1]->Uint32Value();
        double minval = numeric_limits<double>::min();
        double maxval = numeric_limits<double>::max();
        if (args.Length() > 2) minval = args[2]->NumberValue();
        if (args.Length() > 3) maxval = args[3]->NumberValue();
        Guard();
        ArrayWrapper::New(af::histogram(*pArray, nbins, minval, maxval));
    }
    FIRE_CATCH;
}

//AFAPI array 	resize (const array &in, const dim_t odim0, const dim_t odim1, const interpType method=AF_INTERP_NEAREST)
//AFAPI array 	resize (const float scale, const array &in, const interpType method=AF_INTERP_NEAREST)
//AFAPI array 	resize (const float scale0, const float scale1, const array &in, const interpType method=AF_INTERP_NEAREST)

//AFAPI array 	rotate (const array &in, const float theta, const bool crop=true, const interpType method=AF_INTERP_NEAREST)

//AFAPI array 	scale (const array &in, const float scale0, const float scale1, const dim_t odim0=0, const dim_t odim1=0, const interpType method=AF_INTERP_NEAREST)

//AFAPI array 	skew (const array &in, const float skew0, const float skew1, const dim_t odim0=0, const dim_t odim1=0, const bool inverse=true, const interpType method=AF_INTERP_NEAREST)

//AFAPI array 	transform (const array &in, const array &transform, const dim_t odim0=0, const dim_t odim1=0, const interpType method=AF_INTERP_NEAREST, const bool inverse=true)

//AFAPI array 	translate (const array &in, const float trans0, const float trans1, const dim_t odim0=0, const dim_t odim1=0, const interpType method=AF_INTERP_NEAREST)

FIRE_SYNC_METHOD_ARR_ARR(Dilate, dilate)
FIRE_SYNC_METHOD_ARR_ARR(Dilate3, dilate3)
FIRE_SYNC_METHOD_ARR_ARR(Erode, erode)
FIRE_SYNC_METHOD_ARR_ARR(Erode3, erode3)

//AFAPI array 	gaussiankernel (const int rows, const int cols, const double sig_r=0, const double sig_c=0)

void InitImageProcessing(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("loadImage"), NanNew<FunctionTemplate>(LoadImage)->GetFunction());
    exports->Set(NanNew("saveImage"), NanNew<FunctionTemplate>(SaveImage)->GetFunction());
    exports->Set(NanNew("colorSpace"), NanNew<FunctionTemplate>(ColorSpace)->GetFunction());
    exports->Set(NanNew("gray2rgb"), NanNew<FunctionTemplate>(Gray2RGB)->GetFunction());
    exports->Set(NanNew("rgb2gray"), NanNew<FunctionTemplate>(RGB2Gray)->GetFunction());
    exports->Set(NanNew("hsv2rgb"), NanNew<FunctionTemplate>(HSV2RGB)->GetFunction());
    exports->Set(NanNew("rgb2hsv"), NanNew<FunctionTemplate>(RGB2HSV)->GetFunction());
    exports->Set(NanNew("regions"), NanNew<FunctionTemplate>(Regions)->GetFunction());
}
