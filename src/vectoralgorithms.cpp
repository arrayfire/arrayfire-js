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
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        unsigned dim = 0;
        bool asc = true;
        if (args[1]->IsNumber())
        {
            dim = args[1]->Uint32Value();
        }
        if (args.Length() > 2 && args[2]->IsBoolean())
        {
            asc = args[2]->BooleanValue();
        }
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::sort(array, dim, asc)); });
    }
    FIRE_CATCH
}

NAN_METHOD(SortByKey)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto keys = *ArrayWrapper::GetArrayAt(args, 0);
        auto values = *ArrayWrapper::GetArrayAt(args, 1);
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
        auto exec = [=]()
        {
            Guard();
            af::array outKeys, outValues;
            af::sort(outKeys, outValues, keys, values, dim, asc);
            return make_pair(outKeys, outValues);
        };
        typedef pair<af::array, af::array> PairT;
        typedef Worker<PairT> WorkerT;
        auto conv = [=](WorkerT* w, PairT p)
        {
            auto result = NanNew<Object>();
            result->Set(NanNew("keys"), NanNew(ArrayWrapper::New(p.first)));
            result->Set(NanNew("values"), NanNew(ArrayWrapper::New(p.second)));
            return result;
        };
        auto worker = new WorkerT(GetCallback(args), move(exec), move(conv));
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(SortIndex)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        unsigned dim = 0;
        bool asc = true;
        if (args[1]->IsNumber())
        {
            dim = args[1]->Uint32Value();
        }
        if (args.Length() > 2 && args[2]->IsBoolean())
        {
            asc = args[2]->BooleanValue();
        }
        auto exec = [=]()
        {
            Guard();
            af::array outValues, outIndices;
            af::sort(outValues, outIndices, array, dim, asc);
            return make_pair(outValues, outIndices);
        };
        typedef pair<af::array, af::array> PairT;
        typedef Worker<PairT> WorkerT;
        auto conv = [=](WorkerT* w, PairT p)
        {
            auto result = NanNew<Object>();
            result->Set(NanNew("values"), NanNew(ArrayWrapper::New(p.first)));
            result->Set(NanNew("indices"), NanNew(ArrayWrapper::New(p.second)));
            return result;
        };
        auto worker = new WorkerT(GetCallback(args), move(exec), move(conv));
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH
}

FIRE_ASYNC_METHOD_ARR_DIM(Accum, accum)
FIRE_SYNC_METHOD_ARR(Where, where)

FIRE_ASYNC_METHOD_ARR_ARR_BOOL(SetIntersect, setIntersect, false)
FIRE_ASYNC_METHOD_ARR_ARR_BOOL(SetUnion, setUnion, false)
FIRE_ASYNC_METHOD_ARR_BOOL(SetUnique, setUnique, false)
FIRE_ASYNC_METHOD_ARR_DIM(Diff1, diff1)
FIRE_ASYNC_METHOD_ARR_DIM(Diff2, diff2)

NAN_METHOD(Grad)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        auto exec = [=]()
        {
            Guard();
            af::array dx, dy;
            af::grad(dx, dy, array);
            return make_pair(dx, dy);
        };
        typedef pair<af::array, af::array> PairT;
        typedef Worker<PairT> WorkerT;
        auto conv = [=](WorkerT* w, PairT p)
        {
            auto result = NanNew<Object>();
            result->Set(NanNew("dx"), NanNew(ArrayWrapper::New(p.first)));
            result->Set(NanNew("dy"), NanNew(ArrayWrapper::New(p.second)));
            return result;
        };
        auto worker = new WorkerT(GetCallback(args), move(exec), move(conv));
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
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
