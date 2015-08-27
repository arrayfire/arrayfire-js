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

NAN_METHOD(Orb)
{

    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float fastThr=20.f;
        unsigned maxFeat=400;
        float sclFctr=1.5f;
        unsigned levels=4;
        bool blurImg=false;
        if (info.Length() > 1)
        {
            fastThr = info[1]->NumberValue();
        }
        if (info.Length() > 2)
        {
            maxFeat = info[2]->Uint32Value();
        }
        if (info.Length() > 3)
        {
            sclFctr = info[3]->NumberValue();
        }
        if (info.Length() > 4)
        {
            levels = info[4]->Uint32Value();
        }
        if (info.Length() > 5)
        {
            blurImg = info[5]->BooleanValue();
        }
        Guard();
        af::features feat;
        af::array desc;
        af::orb(feat, desc, *pArray, fastThr, maxFeat, sclFctr, levels, blurImg);
        auto result = Nan::New<Object>();
        result->Set(Nan::New(Symbols::Feat), ToV8Features(feat));
        result->Set(Nan::New(Symbols::Desc), ArrayWrapper::New(desc));
        info.GetReturnValue().Set(result);
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Fast)
{

    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        float thr=20.0f;
        unsigned arcLength=9;
        bool nonMax=true;
        float featureRatio=0.05f;
        unsigned edge=3;
        if (info.Length() > 1)
        {
            thr = info[1]->NumberValue();
        }
        if (info.Length() > 2)
        {
            arcLength = info[2]->Uint32Value();
        }
        if (info.Length() > 3)
        {
            nonMax = info[3]->BooleanValue();
        }
        if (info.Length() > 4)
        {
            featureRatio = info[4]->NumberValue();
        }
        if (info.Length() > 5)
        {
            edge = info[5]->Uint32Value();
        }
        Guard();
        auto feat = af::fast(*pArray, thr, arcLength, nonMax, featureRatio, edge);
        info.GetReturnValue().Set(ToV8Features(feat));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(HammingMatcher)
{

    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        dim_t distDim = 0;
        unsigned nDist = 1;
        if (info.Length() > 2)
        {
            distDim = (dim_t)(info[2]->Uint32Value());
        }
        if (info.Length() > 3)
        {
            nDist = info[3]->Uint32Value();
        }
        Guard();
        af::array idx, dist;
        af::hammingMatcher(idx, dist, *pArray1, *pArray2, distDim, nDist);
        auto result = Nan::New<Object>();
        result->Set(Nan::New(Symbols::Idx), ArrayWrapper::New(idx));
        result->Set(Nan::New(Symbols::Dist), ArrayWrapper::New(dist));
        info.GetReturnValue().Set(result);
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(MatchTemplate)
{

    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        af::matchType mType = AF_SAD;
        if (info.Length() > 2)
        {
            mType = (af::matchType)(info[2]->Uint32Value());
        }
        Guard();
        info.GetReturnValue().Set(ArrayWrapper::New(af::matchTemplate(*pArray1, *pArray2, mType)));
    }
    ARRAYFIRE_CATCH
}

NAN_MODULE_INIT(InitComputerVision)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("orb").ToLocalChecked(), Nan::New<FunctionTemplate>(Orb)->GetFunction());
    Nan::Set(target, Nan::New<String>("fast").ToLocalChecked(), Nan::New<FunctionTemplate>(Fast)->GetFunction());
    Nan::Set(target, Nan::New<String>("hammingMatcher").ToLocalChecked(), Nan::New<FunctionTemplate>(HammingMatcher)->GetFunction());
    Nan::Set(target, Nan::New<String>("matchTemplate").ToLocalChecked(), Nan::New<FunctionTemplate>(MatchTemplate)->GetFunction());
}
