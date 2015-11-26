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
#include "mathfunctions.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;
using namespace node;

AF_AM_ALGO_V1(AllTrue, allTrue)
AF_AM_ALGO_V1(AnyTrue, anyTrue)
AF_AM_ALGO_V1(Count, count)
AF_AM_ALGO_V1(FindMax, max)
AF_AM_ALGO_V1(FindMin, min)
AF_AM_ALGO_V1(Product, product)
AF_AM_ALGO_V1(Sum, sum)
AF_AM_ALGO_V2(FindMinAt, min)
AF_AM_ALGO_V2(FindMaxAt, max)

NAN_METHOD(Sort)
{

    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        unsigned dim = 0;
        bool asc = true;
        if (info.Length() > 1 && info[1]->IsNumber())
        {
            dim = info[1]->Uint32Value();
        }
        if (info.Length() > 2 && info[2]->IsBoolean())
        {
            asc = info[2]->BooleanValue();
        }
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::sort(*pArray, dim, asc)));;
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(SortByKey)
{

    try
    {
        ARGS_LEN(2);
        auto pKeys = ArrayWrapper::GetArrayAt(info, 0);
        auto pValues = ArrayWrapper::GetArrayAt(info, 1);
        unsigned dim = 0;
        bool asc = true;
        if (info.Length() > 2 && info[2]->IsNumber())
        {
            dim = info[2]->Uint32Value();
        }
        if (info.Length() > 3 && info[3]->IsBoolean())
        {
            asc = info[3]->BooleanValue();
        }

        Guard guard;
        af::array outKeys, outValues;
        af::sort(outKeys, outValues, *pKeys, *pValues, dim, asc);

        auto result = Nan::New<Object>();
        Nan::Set(result, Nan::New(Symbols::Keys), ArrayWrapper::New(outKeys));
        Nan::Set(result, Nan::New(Symbols::Values), ArrayWrapper::New(outValues));

        info.GetReturnValue().Set(result);
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(SortIndex)
{

    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        unsigned dim = 0;
        bool asc = true;
        if (info.Length() > 1 && info[1]->IsNumber())
        {
            dim = info[1]->Uint32Value();
        }
        if (info.Length() > 2 && info[2]->IsBoolean())
        {
            asc = info[2]->BooleanValue();
        }

        Guard guard;
        af::array outValues, outIndices;
        af::sort(outValues, outIndices, *pArray, dim, asc);

        auto result = Nan::New<Object>();
        result->Set(Nan::New(Symbols::Values), ArrayWrapper::New(outValues));
        result->Set(Nan::New(Symbols::Indices), ArrayWrapper::New(outIndices));
        info.GetReturnValue().Set(result);
    }
    ARRAYFIRE_CATCH
}

AF_SM_ARR_DIM(Accum, accum)
AF_SM_ARR(Where, where)

AF_SM_ARR_ARR_BOOL(SetIntersect, setIntersect, false)
AF_SM_ARR_ARR_BOOL(SetUnion, setUnion, false)
AF_SM_ARR_BOOL(SetUnique, setUnique, false)
AF_SM_ARR_DIM(Diff1, diff1)
AF_SM_ARR_DIM(Diff2, diff2)

NAN_METHOD(Grad)
{
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);

        Guard guard;
        af::array dx, dy;
        af::grad(dx, dy, *pArray);

        auto result = Nan::New<Object>();
        result->Set(Nan::New(Symbols::DX), (ArrayWrapper::New(dx)));
        result->Set(Nan::New(Symbols::DY), (ArrayWrapper::New(dy)));
        info.GetReturnValue().Set(result);
    }
    ARRAYFIRE_CATCH
}

NAN_MODULE_INIT(InitVectorAlgorithms)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("allTrue").ToLocalChecked(), Nan::New<FunctionTemplate>(AllTrue)->GetFunction());
    Nan::Set(target, Nan::New<String>("anyTrue").ToLocalChecked(), Nan::New<FunctionTemplate>(AnyTrue)->GetFunction());
    Nan::Set(target, Nan::New<String>("count").ToLocalChecked(), Nan::New<FunctionTemplate>(Count)->GetFunction());
    Nan::Set(target, Nan::New<String>("findMax").ToLocalChecked(), Nan::New<FunctionTemplate>(FindMax)->GetFunction());
    Nan::Set(target, Nan::New<String>("findMaxAt").ToLocalChecked(), Nan::New<FunctionTemplate>(FindMaxAt)->GetFunction());
    Nan::Set(target, Nan::New<String>("findMin").ToLocalChecked(), Nan::New<FunctionTemplate>(FindMin)->GetFunction());
    Nan::Set(target, Nan::New<String>("findMinAt").ToLocalChecked(), Nan::New<FunctionTemplate>(FindMinAt)->GetFunction());
    Nan::Set(target, Nan::New<String>("product").ToLocalChecked(), Nan::New<FunctionTemplate>(Product)->GetFunction());
    Nan::Set(target, Nan::New<String>("sum").ToLocalChecked(), Nan::New<FunctionTemplate>(Sum)->GetFunction());

    Nan::Set(target, Nan::New<String>("sort").ToLocalChecked(), Nan::New<FunctionTemplate>(Sort)->GetFunction());
    Nan::Set(target, Nan::New<String>("sortByKey").ToLocalChecked(), Nan::New<FunctionTemplate>(SortByKey)->GetFunction());
    Nan::Set(target, Nan::New<String>("sortIndex").ToLocalChecked(), Nan::New<FunctionTemplate>(SortIndex)->GetFunction());

    Nan::Set(target, Nan::New<String>("accum").ToLocalChecked(), Nan::New<FunctionTemplate>(Accum)->GetFunction());
    Nan::Set(target, Nan::New<String>("where").ToLocalChecked(), Nan::New<FunctionTemplate>(Where)->GetFunction());

    Nan::Set(target, Nan::New<String>("setIntersect").ToLocalChecked(), Nan::New<FunctionTemplate>(SetIntersect)->GetFunction());
    Nan::Set(target, Nan::New<String>("setUnion").ToLocalChecked(), Nan::New<FunctionTemplate>(SetUnion)->GetFunction());
    Nan::Set(target, Nan::New<String>("setUnique").ToLocalChecked(), Nan::New<FunctionTemplate>(SetUnique)->GetFunction());
    Nan::Set(target, Nan::New<String>("diff1").ToLocalChecked(), Nan::New<FunctionTemplate>(Diff1)->GetFunction());
    Nan::Set(target, Nan::New<String>("diff2").ToLocalChecked(), Nan::New<FunctionTemplate>(Diff2)->GetFunction());
    Nan::Set(target, Nan::New<String>("grad").ToLocalChecked(), Nan::New<FunctionTemplate>(Grad)->GetFunction());
}
