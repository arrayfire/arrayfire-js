/*
Copyright 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
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
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float fastThr=20.f;
        unsigned maxFeat=400;
        float sclFctr=1.5f;
        unsigned levels=4;
        bool blurImg=false;
        if (args.Length() > 1)
        {
            fastThr = args[1]->NumberValue();
        }
        if (args.Length() > 2)
        {
            maxFeat = args[2]->Uint32Value();
        }
        if (args.Length() > 3)
        {
            sclFctr = args[3]->NumberValue();
        }
        if (args.Length() > 4)
        {
            levels = args[4]->Uint32Value();
        }
        if (args.Length() > 5)
        {
            blurImg = args[5]->BooleanValue();
        }
        Guard();
        af::features feat;
        af::array desc;
        af::orb(feat, desc, *pArray, fastThr, maxFeat, sclFctr, levels, blurImg);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Feat), ToV8Features(feat));
        result->Set(NanNew(Symbols::Desc), ArrayWrapper::New(desc));
        NanReturnValue(result);
    }
    FIRE_CATCH
}

NAN_METHOD(Fast)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        float thr=20.0f;
        unsigned arcLength=9;
        bool nonMax=true;
        float featureRatio=0.05f;
        unsigned edge=3;
        if (args.Length() > 1)
        {
            thr = args[1]->NumberValue();
        }
        if (args.Length() > 2)
        {
            arcLength = args[2]->Uint32Value();
        }
        if (args.Length() > 3)
        {
            nonMax = args[3]->BooleanValue();
        }
        if (args.Length() > 4)
        {
            featureRatio = args[4]->NumberValue();
        }
        if (args.Length() > 5)
        {
            edge = args[5]->Uint32Value();
        }
        Guard();
        auto feat = af::fast(*pArray, thr, arcLength, nonMax, featureRatio, edge);
        NanReturnValue(ToV8Features(feat));
    }
    FIRE_CATCH
}

NAN_METHOD(HammingMatcher)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        dim_t distDim = 0;
        unsigned nDist = 1;
        if (args.Length() > 2)
        {
            distDim = (dim_t)(args[2]->Uint32Value());
        }
        if (args.Length() > 3)
        {
            nDist = args[3]->Uint32Value();
        }
        Guard();
        af::array idx, dist;
        af::hammingMatcher(idx, dist, *pArray1, *pArray2, distDim, nDist);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Idx), ArrayWrapper::New(idx));
        result->Set(NanNew(Symbols::Dist), ArrayWrapper::New(dist));
        NanReturnValue(result);
    }
    FIRE_CATCH
}

NAN_METHOD(MatchTemplate)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        af::matchType mType = AF_SAD;
        if (args.Length() > 2)
        {
            mType = (af::matchType)(args[2]->Uint32Value());
        }
        Guard();
        NanReturnValue(ArrayWrapper::New(af::matchTemplate(*pArray1, *pArray2, mType)));
    }
    FIRE_CATCH
}

void InitComputerVision(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("orb"), NanNew<FunctionTemplate>(Orb)->GetFunction());
    exports->Set(NanNew("fast"), NanNew<FunctionTemplate>(Fast)->GetFunction());
    exports->Set(NanNew("matchTemplate"), NanNew<FunctionTemplate>(MatchTemplate)->GetFunction());
}
