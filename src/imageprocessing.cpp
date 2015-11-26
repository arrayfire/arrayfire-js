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

    try
    {
        ARGS_LEN(2);
        String::Utf8Value str(info[0]);
        string fn(*str);
        bool isColor = false;
        if (info.Length() > 1)
        {
            isColor = info[1]->BooleanValue();
        }
        ArrayWrapper::NewAsync(
                info,
                [=](){ Guard guard; return new af::array(af::loadImage(fn.c_str(), isColor)); });
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(SaveImage)
{

    try
    {
        ARGS_LEN(3);
        String::Utf8Value str(info[0]);
        string fn(*str);
        auto array = *ArrayWrapper::GetArrayAt(info, 1);
        auto exec = [=]()
        {
            Guard guard;
            af::saveImage(fn.c_str(), array);
        };
        auto worker = new Worker<void>(GetCallback(info), move(exec));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(ColorSpace)
{

    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        auto to = (af::CSpace)info[1]->Uint32Value();
        auto from = (af::CSpace)info[2]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::colorSpace(*pArray, to, from));
    }
    ARRAYFIRE_CATCH;
}

AF_SM_ARR_FLOAT_FLOAT_FLOAT(Gray2RGB, gray2rgb, 1.0f, 1.0f, 1.0f)
AF_SM_ARR_FLOAT_FLOAT_FLOAT(RGB2Gray, rgb2gray, 0.2126f, 0.7152f, 0.0722f)
AF_SM_ARR(HSV2RGB, hsv2rgb)
AF_SM_ARR(RGB2HSV, rgb2hsv)

NAN_METHOD(Regions)
{

    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        af::connectivity conn = AF_CONNECTIVITY_4;
        af::dtype dtype = f32;
        if (info.Length() > 1) conn = (af::connectivity)info[1]->Uint32Value();
        if (info.Length() > 2) dtype = GetDTypeInfo(info[2]).first;
        Guard guard;
        ArrayWrapper::New(af::regions(*pArray, conn, dtype));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Bilateral)
{

    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float spatialSigma = info[1]->NumberValue();
        float chromaticSigma = info[2]->NumberValue();
        bool isColor = false;
        if (info.Length() > 3) isColor = info[3]->BooleanValue();
        Guard guard;
        ArrayWrapper::New(af::bilateral(*pArray, spatialSigma, chromaticSigma, isColor));
    }
    ARRAYFIRE_CATCH;
}

#define ARRAYFIRE_FILT_METHOD(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(1);\
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        dim_t windLength = 3;\
        dim_t windWidth = 3;\
        af::borderType edgePad = AF_PAD_ZERO;\
        if (info.Length() > 1) windLength = info[1]->Uint32Value();\
        if (info.Length() > 2) windWidth = info[2]->Uint32Value();\
        if (info.Length() > 3) edgePad = (af::borderType)info[3]->Uint32Value();\
        Guard guard;\
        ArrayWrapper::New(af::f(*pArray, windLength, windWidth, edgePad));\
    }\
    ARRAYFIRE_CATCH;\
}

ARRAYFIRE_FILT_METHOD(MaxFilt, maxfilt)
ARRAYFIRE_FILT_METHOD(MinFilt, minfilt)
ARRAYFIRE_FILT_METHOD(MedFilt, medfilt)
#undef ARRAYFIRE_FILT_METHOD

NAN_METHOD(MeanShift)
{

    try
    {
        ARGS_LEN(4);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float spatialSigma = info[1]->NumberValue();
        float chromaticSigma = info[2]->NumberValue();
        unsigned iter = info[3]->Uint32Value();
        bool isColor = false;
        if (info.Length() > 4) isColor = info[4]->BooleanValue();
        Guard guard;
        ArrayWrapper::New(af::meanShift(*pArray, spatialSigma, chromaticSigma, iter, isColor));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Sobel)
{

    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        unsigned kerSize = 3;
        if (info.Length() > 1) kerSize = info[1]->Uint32Value();
        Guard guard;
        af::array dx, dy;
        af::sobel(dx, dy, *pArray, kerSize);
        auto result = Nan::New<Object>();
        result->Set(Nan::New(Symbols::DX), ArrayWrapper::New(dx));
        result->Set(Nan::New(Symbols::DY), ArrayWrapper::New(dy));
        info.GetReturnValue().Set(result);
    }
    ARRAYFIRE_CATCH;
}

AF_SM_ARR_ARR(HistEqual, histEqual)

NAN_METHOD(Histogram)
{

    try
    {
        ARGS_LEN(2);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        unsigned nbins = info[1]->Uint32Value();
        double minval = numeric_limits<double>::min();
        double maxval = numeric_limits<double>::max();
        if (info.Length() > 2) minval = info[2]->NumberValue();
        if (info.Length() > 3) maxval = info[3]->NumberValue();
        Guard guard;
        ArrayWrapper::New(af::histogram(*pArray, nbins, minval, maxval));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Resize)
{

    try
    {
        ARGS_LEN(2);
        auto pIn = ArrayWrapper::TryGetArrayAt(info, 0);
        af::interpType method = AF_INTERP_NEAREST;
        if (pIn)
        {
            dim_t odim0 = info[1]->Uint32Value();
            dim_t odim1 = info[2]->Uint32Value();
            if (info.Length() > 3) method = (af::interpType)info[3]->Uint32Value();
            Guard guard;
            ArrayWrapper::New(af::resize(*pIn, odim0, odim1, method));
        }
        else
        {
            pIn = ArrayWrapper::TryGetArrayAt(info, 1);
            if (pIn)
            {
                float scale = info[0]->NumberValue();
                if (info.Length() > 2) method = (af::interpType)info[2]->Uint32Value();
                Guard guard;
                ArrayWrapper::New(af::resize(scale, *pIn, method));
            }
            else
            {
                float scale0 = info[0]->NumberValue();
                float scale1 = info[1]->NumberValue();
                pIn = ArrayWrapper::GetArrayAt(info, 2);
                if (info.Length() > 3) method = (af::interpType)info[3]->Uint32Value();
                Guard guard;
                ArrayWrapper::New(af::resize(scale0, scale1, *pIn, method));
            }
        }
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Rotate)
{

    try
    {
        ARGS_LEN(2);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float theta = info[1]->NumberValue();
        bool crop = true;
        af::interpType method = AF_INTERP_NEAREST;
        if (info.Length() > 2) crop = info[2]->BooleanValue();
        if (info.Length() > 3) method = (af::interpType)info[3]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::rotate(*pArray, theta, crop, method));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Scale)
{

    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float scale0 = info[1]->NumberValue();
        float scale1 = info[2]->NumberValue();
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        af::interpType method = AF_INTERP_NEAREST;
        if (info.Length() > 3) odim0 = info[3]->Uint32Value();
        if (info.Length() > 4) odim1 = info[4]->Uint32Value();
        if (info.Length() > 5) method = (af::interpType)info[5]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::scale(*pArray, scale0, scale1, odim0, odim1, method));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Skew)
{

    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float skew0 = info[1]->NumberValue();
        float skew1 = info[2]->NumberValue();
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        bool inverse = true;
        af::interpType method = AF_INTERP_NEAREST;
        if (info.Length() > 3) odim0 = info[3]->Uint32Value();
        if (info.Length() > 4) odim1 = info[4]->Uint32Value();
        if (info.Length() > 5) inverse = info[5]->BooleanValue();
        if (info.Length() > 6) method = (af::interpType)info[6]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::skew(*pArray, skew0, skew1, odim0, odim1, inverse, method));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Transform)
{

    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        bool inverse = true;
        af::interpType method = AF_INTERP_NEAREST;
        if (info.Length() > 2) odim0 = info[2]->Uint32Value();
        if (info.Length() > 3) odim1 = info[3]->Uint32Value();
        if (info.Length() > 4) inverse = info[4]->BooleanValue();
        if (info.Length() > 5) method = (af::interpType)info[5]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::transform(*pArray1, *pArray2, odim0, odim1, method, inverse));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Translate)
{

    try
    {
        ARGS_LEN(3);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float trans0 = info[1]->NumberValue();
        float trans1 = info[2]->NumberValue();
        dim_t odim0 = 0;
        dim_t odim1 = 0;
        af::interpType method = AF_INTERP_NEAREST;
        if (info.Length() > 3) odim0 = info[3]->Uint32Value();
        if (info.Length() > 4) odim1 = info[4]->Uint32Value();
        if (info.Length() > 5) method = (af::interpType)info[5]->Uint32Value();
        Guard guard;
        ArrayWrapper::New(af::translate(*pArray, trans0, trans1, odim0, odim1, method));
    }
    ARRAYFIRE_CATCH;
}

AF_SM_ARR_ARR(Dilate, dilate)
AF_SM_ARR_ARR(Dilate3, dilate3)
AF_SM_ARR_ARR(Erode, erode)
AF_SM_ARR_ARR(Erode3, erode3)

NAN_METHOD(GaussianKernel)
{

    try
    {
        ARGS_LEN(2);
        int rows = info[0]->Int32Value();
        int cols = info[1]->Int32Value();
        double sigR = 0;
        double sigC = 0;
        if (info.Length() > 2) sigR = info[2]->NumberValue();
        if (info.Length() > 3) sigC = info[3]->NumberValue();
        Guard guard;
        ArrayWrapper::New(af::gaussianKernel(rows, cols, sigR, sigC));
    }
    ARRAYFIRE_CATCH;
}

NAN_MODULE_INIT(InitImageProcessing)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("loadImage").ToLocalChecked(), Nan::New<FunctionTemplate>(LoadImage)->GetFunction());
    Nan::Set(target, Nan::New<String>("saveImage").ToLocalChecked(), Nan::New<FunctionTemplate>(SaveImage)->GetFunction());
    Nan::Set(target, Nan::New<String>("colorSpace").ToLocalChecked(), Nan::New<FunctionTemplate>(ColorSpace)->GetFunction());
    Nan::Set(target, Nan::New<String>("gray2rgb").ToLocalChecked(), Nan::New<FunctionTemplate>(Gray2RGB)->GetFunction());
    Nan::Set(target, Nan::New<String>("rgb2gray").ToLocalChecked(), Nan::New<FunctionTemplate>(RGB2Gray)->GetFunction());
    Nan::Set(target, Nan::New<String>("hsv2rgb").ToLocalChecked(), Nan::New<FunctionTemplate>(HSV2RGB)->GetFunction());
    Nan::Set(target, Nan::New<String>("rgb2hsv").ToLocalChecked(), Nan::New<FunctionTemplate>(RGB2HSV)->GetFunction());
    Nan::Set(target, Nan::New<String>("regions").ToLocalChecked(), Nan::New<FunctionTemplate>(Regions)->GetFunction());
    Nan::Set(target, Nan::New<String>("bilateral").ToLocalChecked(), Nan::New<FunctionTemplate>(Bilateral)->GetFunction());
    Nan::Set(target, Nan::New<String>("maxfilt").ToLocalChecked(), Nan::New<FunctionTemplate>(MaxFilt)->GetFunction());
    Nan::Set(target, Nan::New<String>("maxFilt").ToLocalChecked(), Nan::New<FunctionTemplate>(MaxFilt)->GetFunction());
    Nan::Set(target, Nan::New<String>("minfilt").ToLocalChecked(), Nan::New<FunctionTemplate>(MinFilt)->GetFunction());
    Nan::Set(target, Nan::New<String>("minFilt").ToLocalChecked(), Nan::New<FunctionTemplate>(MinFilt)->GetFunction());
    Nan::Set(target, Nan::New<String>("medfilt").ToLocalChecked(), Nan::New<FunctionTemplate>(MedFilt)->GetFunction());
    Nan::Set(target, Nan::New<String>("medFilt").ToLocalChecked(), Nan::New<FunctionTemplate>(MedFilt)->GetFunction());
    Nan::Set(target, Nan::New<String>("meanShift").ToLocalChecked(), Nan::New<FunctionTemplate>(MeanShift)->GetFunction());
    Nan::Set(target, Nan::New<String>("sobel").ToLocalChecked(), Nan::New<FunctionTemplate>(Sobel)->GetFunction());
    Nan::Set(target, Nan::New<String>("histEqual").ToLocalChecked(), Nan::New<FunctionTemplate>(HistEqual)->GetFunction());
    Nan::Set(target, Nan::New<String>("histogram").ToLocalChecked(), Nan::New<FunctionTemplate>(Histogram)->GetFunction());
    Nan::Set(target, Nan::New<String>("resize").ToLocalChecked(), Nan::New<FunctionTemplate>(Resize)->GetFunction());
    Nan::Set(target, Nan::New<String>("rotate").ToLocalChecked(), Nan::New<FunctionTemplate>(Rotate)->GetFunction());
    Nan::Set(target, Nan::New<String>("scale").ToLocalChecked(), Nan::New<FunctionTemplate>(Scale)->GetFunction());
    Nan::Set(target, Nan::New<String>("skew").ToLocalChecked(), Nan::New<FunctionTemplate>(Skew)->GetFunction());
    Nan::Set(target, Nan::New<String>("transform").ToLocalChecked(), Nan::New<FunctionTemplate>(Transform)->GetFunction());
    Nan::Set(target, Nan::New<String>("translate").ToLocalChecked(), Nan::New<FunctionTemplate>(Translate)->GetFunction());
    Nan::Set(target, Nan::New<String>("dilate").ToLocalChecked(), Nan::New<FunctionTemplate>(Dilate)->GetFunction());
    Nan::Set(target, Nan::New<String>("dilate3").ToLocalChecked(), Nan::New<FunctionTemplate>(Dilate3)->GetFunction());
    Nan::Set(target, Nan::New<String>("erode").ToLocalChecked(), Nan::New<FunctionTemplate>(Erode)->GetFunction());
    Nan::Set(target, Nan::New<String>("erode3").ToLocalChecked(), Nan::New<FunctionTemplate>(Erode3)->GetFunction());
    Nan::Set(target, Nan::New<String>("gaussianKernel").ToLocalChecked(), Nan::New<FunctionTemplate>(GaussianKernel)->GetFunction());
}
