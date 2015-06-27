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

ARRAYFIRE_SYNC_METHOD_ARR_ARR_BOOL(Cov, cov, false)
ARRAYFIRE_ASYNC_METHOD_ALGO_V1(Mean, mean)
ARRAYFIRE_ASYNC_METHOD_ALGO_V3(WeightedMean, mean)
ARRAYFIRE_ASYNC_METHOD_ALGO_V1(Median, median)
ARRAYFIRE_ASYNC_METHOD_ALGO_V1(StDev, stdev)

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
    ARRAYFIRE_CATCH
}

ARRAYFIRE_ASYNC_METHOD_ALGO_V3(WeightedVar, var)

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
    ARRAYFIRE_CATCH
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
