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

NAN_METHOD(Resize)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pIn = ArrayWrapper::TryGetArrayAt(args, 0);
        af::interpType method = AF_INTERP_NEAREST;
        if (pIn)
        {
            dim_t odim0 = args[1]->Uint32Value();
            dim_t odim1 = args[2]->Uint32Value();
            if (args.Length() > 3) method = (af::interpType)args[3]->Uint32Value();
            Guard();
            ArrayWrapper::New(af::resize(*pIn, odim0, odim1, method));
        }
        else
        {
            pIn = ArrayWrapper::TryGetArrayAt(args, 1);
            if (pIn)
            {
                float scale = args[0]->NumberValue();
                if (args.Length() > 2) method = (af::interpType)args[2]->Uint32Value();
                Guard();
                ArrayWrapper::New(af::resize(scale, *pIn, method));
            }
            else
            {
                float scale0 = args[0]->NumberValue();
                float scale1 = args[1]->NumberValue();
                pIn = ArrayWrapper::GetArrayAt(args, 2);
                if (args.Length() > 3) method = (af::interpType)args[3]->Uint32Value();
                Guard();
                ArrayWrapper::New(af::resize(scale0, scale1, *pIn, method));
            }
        }
    }
    FIRE_CATCH;
}

NAN_METHOD(Rotate)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float theta = args[1]->NumberValue();
        bool crop = true;
        af::interpType method = AF_INTERP_NEAREST;
        if (args.Length() > 2) crop = args[2]->BooleanValue();
        if (args.Length() > 3) method = (af::interpType)args[3]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::rotate(*pArray, theta, crop, method));
    }
    FIRE_CATCH;
}

NAN_METHOD(Scale)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float scale0 = args[1]->NumberValue();
        float scale1 = args[2]->NumberValue();
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        af::interpType method = AF_INTERP_NEAREST;
        if (args.Length() > 3) odim0 = args[3]->Uint32Value();
        if (args.Length() > 4) odim1 = args[4]->Uint32Value();
        if (args.Length() > 5) method = (af::interpType)args[5]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::scale(*pArray, scale0, scale1, odim0, odim1, method));
    }
    FIRE_CATCH;
}

NAN_METHOD(Skew)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float skew0 = args[1]->NumberValue();
        float skew1 = args[2]->NumberValue();
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        bool inverse = true;
        af::interpType method = AF_INTERP_NEAREST;
        if (args.Length() > 3) odim0 = args[3]->Uint32Value();
        if (args.Length() > 4) odim1 = args[4]->Uint32Value();
        if (args.Length() > 5) inverse = args[5]->BooleanValue();
        if (args.Length() > 6) method = (af::interpType)args[6]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::skew(*pArray, skew0, skew1, odim0, odim1, inverse, method));
    }
    FIRE_CATCH;
}

NAN_METHOD(Transform)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        bool inverse = true;
        af::interpType method = AF_INTERP_NEAREST;
        if (args.Length() > 2) odim0 = args[2]->Uint32Value();
        if (args.Length() > 3) odim1 = args[3]->Uint32Value();
        if (args.Length() > 4) inverse = args[4]->BooleanValue();
        if (args.Length() > 5) method = (af::interpType)args[5]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::transform(*pArray1, *pArray2, odim0, odim1, method, inverse));
    }
    FIRE_CATCH;
}

NAN_METHOD(Translate)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float trans0 = args[1]->NumberValue();
        float trans1 = args[2]->NumberValue();
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        af::interpType method = AF_INTERP_NEAREST;
        if (args.Length() > 3) odim0 = args[3]->Uint32Value();
        if (args.Length() > 4) odim1 = args[4]->Uint32Value();
        if (args.Length() > 5) method = (af::interpType)args[5]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::translate(*pArray, trans0, trans1, odim0, odim1, method));
    }
    FIRE_CATCH;
}

FIRE_SYNC_METHOD_ARR_ARR(Dilate, dilate)
FIRE_SYNC_METHOD_ARR_ARR(Dilate3, dilate3)
FIRE_SYNC_METHOD_ARR_ARR(Erode, erode)
FIRE_SYNC_METHOD_ARR_ARR(Erode3, erode3)

NAN_METHOD(GaussianKernel)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        int rows = args[0]->Int32Value();
        int cols = args[1]->Int32Value();
        double sigR = 0;
        double sigC = 0;
        if (args.Length() > 2) sigR = args[2]->NumberValue();
        if (args.Length() > 3) sigC = args[3]->NumberValue();
        Guard();
        ArrayWrapper::New(af::gaussianKernel(rows, cols, sigR, sigC));
    }
    FIRE_CATCH;
}

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
    exports->Set(NanNew("bilateral"), NanNew<FunctionTemplate>(Bilateral)->GetFunction());
    exports->Set(NanNew("maxFilt"), NanNew<FunctionTemplate>(MaxFilt)->GetFunction());
    exports->Set(NanNew("minFilt"), NanNew<FunctionTemplate>(MinFilt)->GetFunction());
    exports->Set(NanNew("medFilt"), NanNew<FunctionTemplate>(MedFilt)->GetFunction());
    exports->Set(NanNew("meanShift"), NanNew<FunctionTemplate>(MeanShift)->GetFunction());
    exports->Set(NanNew("sobel"), NanNew<FunctionTemplate>(Sobel)->GetFunction());
    exports->Set(NanNew("histEqual"), NanNew<FunctionTemplate>(HistEqual)->GetFunction());
    exports->Set(NanNew("histogram"), NanNew<FunctionTemplate>(Histogram)->GetFunction());
    exports->Set(NanNew("resize"), NanNew<FunctionTemplate>(Resize)->GetFunction());
    exports->Set(NanNew("rotate"), NanNew<FunctionTemplate>(Rotate)->GetFunction());
    exports->Set(NanNew("scale"), NanNew<FunctionTemplate>(Scale)->GetFunction());
    exports->Set(NanNew("skew"), NanNew<FunctionTemplate>(Skew)->GetFunction());
    exports->Set(NanNew("transform"), NanNew<FunctionTemplate>(Transform)->GetFunction());
    exports->Set(NanNew("translate"), NanNew<FunctionTemplate>(Translate)->GetFunction());
    exports->Set(NanNew("dilate"), NanNew<FunctionTemplate>(Dilate)->GetFunction());
    exports->Set(NanNew("dilate3"), NanNew<FunctionTemplate>(Dilate3)->GetFunction());
    exports->Set(NanNew("erode"), NanNew<FunctionTemplate>(Erode)->GetFunction());
    exports->Set(NanNew("erode3"), NanNew<FunctionTemplate>(Erode3)->GetFunction());
    exports->Set(NanNew("gaussianKernel"), NanNew<FunctionTemplate>(GaussianKernel)->GetFunction());
}
