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

FIRE_ASYNC_METHOD_ARR_ARR_BOOL(Cov, cov, false)
FIRE_ASYNC_METHOD_ALGO_V1(Mean, mean)
FIRE_ASYNC_METHOD_ALGO_V3(WeightedMean, mean)
FIRE_ASYNC_METHOD_ALGO_V1(Median, median)
FIRE_ASYNC_METHOD_ALGO_V1(StDev, stdev)

NAN_METHOD(Var)
{
    NanScope();
    try
    {
        ARGS_LEN(3);

        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        bool biased = args[1]->BooleanValue();
        if (args.Length() > 3)
        {
            int dim = args[2]->Int32Value();
            return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::var(array, biased, dim)); });
        }
        else
        {
            if (NeedsDouble(array))
            {
                auto exec = [=]() { Guard(); return af::var<double>(array, biased); };
                auto worker = new Worker<double>(GetCallback(args), std::move(exec));
                NanAsyncQueueWorker(worker);
                NanReturnUndefined();
            }
            else
            {
                auto exec = [=]() { Guard(); return af::var<float>(array, biased); };
                auto worker = new Worker<float>(GetCallback(args), std::move(exec));
                NanAsyncQueueWorker(worker);
                NanReturnUndefined();
            }
        }
    }
    FIRE_CATCH
}

FIRE_ASYNC_METHOD_ALGO_V3(WeightedVar, var)

NAN_METHOD(CorrCoef)
{
    NanScope();
    try
    {
        ARGS_LEN(3);

        auto array1 = *ArrayWrapper::GetArrayAt(args, 0);
        auto array2 = *ArrayWrapper::GetArrayAt(args, 1);
       if (NeedsDouble(array1))
        {
            auto exec = [=]() { Guard(); return af::corrcoef<double>(array1, array2); };
            auto worker = new Worker<double>(GetCallback(args), std::move(exec));
            NanAsyncQueueWorker(worker);
            NanReturnUndefined();
        }
        else
        {
            auto exec = [=]() { Guard(); return af::corrcoef<float>(array1, array2); };
            auto worker = new Worker<float>(GetCallback(args), std::move(exec));
            NanAsyncQueueWorker(worker);
            NanReturnUndefined();
        }
    }
    FIRE_CATCH
}

void InitStatistics(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("cov"), NanNew<FunctionTemplate>(Cov)->GetFunction());
    exports->Set(NanNew("mean"), NanNew<FunctionTemplate>(Mean)->GetFunction());
    exports->Set(NanNew("weightedMean"), NanNew<FunctionTemplate>(Mean)->GetFunction());
    exports->Set(NanNew("median"), NanNew<FunctionTemplate>(Median)->GetFunction());
    exports->Set(NanNew("stdev"), NanNew<FunctionTemplate>(StDev)->GetFunction());
    exports->Set(NanNew("stDev"), NanNew<FunctionTemplate>(StDev)->GetFunction());
    exports->Set(NanNew("stdDev"), NanNew<FunctionTemplate>(StDev)->GetFunction());
    exports->Set(NanNew("var"), NanNew<FunctionTemplate>(Var)->GetFunction());
    exports->Set(NanNew("weightedVar"), NanNew<FunctionTemplate>(WeightedVar)->GetFunction());
    exports->Set(NanNew("corrcoef"), NanNew<FunctionTemplate>(CorrCoef)->GetFunction());
    exports->Set(NanNew("corrCoef"), NanNew<FunctionTemplate>(CorrCoef)->GetFunction());
}
