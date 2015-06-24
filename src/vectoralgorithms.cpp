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

FIRE_ASYNC_METHOD_ALGO_V1(AllTrue, allTrue)
FIRE_ASYNC_METHOD_ALGO_V1(AnyTrue, anyTrue)
FIRE_ASYNC_METHOD_ALGO_V1(Count, count)
FIRE_ASYNC_METHOD_ALGO_V1(FindMax, max)
FIRE_ASYNC_METHOD_ALGO_V1(FindMin, min)
FIRE_ASYNC_METHOD_ALGO_V1(Product, product)
FIRE_ASYNC_METHOD_ALGO_V1(Sum, sum)
FIRE_ASYNC_METHOD_ALGO_V2(FindMinAt, min)
FIRE_ASYNC_METHOD_ALGO_V2(FindMaxAt, max)

NAN_METHOD(Sort)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        unsigned dim = 0;
        bool asc = true;
        if (args.Length() > 1 && args[1]->IsNumber())
        {
            dim = args[1]->Uint32Value();
        }
        if (args.Length() > 2 && args[2]->IsBoolean())
        {
            asc = args[2]->BooleanValue();
        }
        Guard();
        NanReturnValue(ArrayWrapper::New(af::sort(*pArray, dim, asc)));;
    }
    FIRE_CATCH
}

NAN_METHOD(SortByKey)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pKeys = ArrayWrapper::GetArrayAt(args, 0);
        auto pValues = ArrayWrapper::GetArrayAt(args, 1);
        unsigned dim = 0;
        bool asc = true;
        if (args.Length() > 2 && args[2]->IsNumber())
        {
            dim = args[2]->Uint32Value();
        }
        if (args.Length() > 3 && args[3]->IsBoolean())
        {
            asc = args[3]->BooleanValue();
        }

        Guard();
        af::array outKeys, outValues;
        af::sort(outKeys, outValues, *pKeys, *pValues, dim, asc);

        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Keys), NanNew(ArrayWrapper::New(outKeys)));
        result->Set(NanNew(Symbols::Values), NanNew(ArrayWrapper::New(outValues)));

        NanReturnValue(result);
    }
    FIRE_CATCH
}

NAN_METHOD(SortIndex)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        unsigned dim = 0;
        bool asc = true;
        if (args.Length() > 1 && args[1]->IsNumber())
        {
            dim = args[1]->Uint32Value();
        }
        if (args.Length() > 2 && args[2]->IsBoolean())
        {
            asc = args[2]->BooleanValue();
        }

        Guard();
        af::array outValues, outIndices;
        af::sort(outValues, outIndices, *pArray, dim, asc);

        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Values), NanNew(ArrayWrapper::New(outValues)));
        result->Set(NanNew(Symbols::Indices), NanNew(ArrayWrapper::New(outIndices)));
        NanReturnValue(result);
    }
    FIRE_CATCH
}

FIRE_SYNC_METHOD_ARR_DIM(Accum, accum)
FIRE_SYNC_METHOD_ARR(Where, where)

FIRE_SYNC_METHOD_ARR_ARR_BOOL(SetIntersect, setIntersect, false)
FIRE_SYNC_METHOD_ARR_ARR_BOOL(SetUnion, setUnion, false)
FIRE_SYNC_METHOD_ARR_BOOL(SetUnique, setUnique, false)
FIRE_SYNC_METHOD_ARR_DIM(Diff1, diff1)
FIRE_SYNC_METHOD_ARR_DIM(Diff2, diff2)

NAN_METHOD(Grad)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);

        Guard();
        af::array dx, dy;
        af::grad(dx, dy, *pArray);

        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::DX), NanNew(ArrayWrapper::New(dx)));
        result->Set(NanNew(Symbols::DY), NanNew(ArrayWrapper::New(dy)));
        NanReturnValue(result);
    }
    FIRE_CATCH
}

void InitVectorAlgorithms(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("allTrue"), NanNew<FunctionTemplate>(AllTrue)->GetFunction());
    exports->Set(NanNew("anyTrue"), NanNew<FunctionTemplate>(AnyTrue)->GetFunction());
    exports->Set(NanNew("count"), NanNew<FunctionTemplate>(Count)->GetFunction());
    exports->Set(NanNew("findMax"), NanNew<FunctionTemplate>(FindMax)->GetFunction());
    exports->Set(NanNew("findMaxAt"), NanNew<FunctionTemplate>(FindMaxAt)->GetFunction());
    exports->Set(NanNew("findMin"), NanNew<FunctionTemplate>(FindMin)->GetFunction());
    exports->Set(NanNew("findMinAt"), NanNew<FunctionTemplate>(FindMinAt)->GetFunction());
    exports->Set(NanNew("product"), NanNew<FunctionTemplate>(Product)->GetFunction());
    exports->Set(NanNew("sum"), NanNew<FunctionTemplate>(Sum)->GetFunction());

    exports->Set(NanNew("sort"), NanNew<FunctionTemplate>(Sort)->GetFunction());
    exports->Set(NanNew("sortByKey"), NanNew<FunctionTemplate>(SortByKey)->GetFunction());
    exports->Set(NanNew("sortIndex"), NanNew<FunctionTemplate>(SortIndex)->GetFunction());

    exports->Set(NanNew("accum"), NanNew<FunctionTemplate>(Accum)->GetFunction());
    exports->Set(NanNew("where"), NanNew<FunctionTemplate>(Where)->GetFunction());

    exports->Set(NanNew("setIntersect"), NanNew<FunctionTemplate>(SetIntersect)->GetFunction());
    exports->Set(NanNew("setUnion"), NanNew<FunctionTemplate>(SetUnion)->GetFunction());
    exports->Set(NanNew("setUnique"), NanNew<FunctionTemplate>(SetUnique)->GetFunction());
    exports->Set(NanNew("diff1"), NanNew<FunctionTemplate>(Diff1)->GetFunction());
    exports->Set(NanNew("diff2"), NanNew<FunctionTemplate>(Diff2)->GetFunction());
    exports->Set(NanNew("grad"), NanNew<FunctionTemplate>(Grad)->GetFunction());
}
