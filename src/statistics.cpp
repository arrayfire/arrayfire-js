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

    try
    {
        ARGS_LEN(3);

        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        bool biased = info[1]->BooleanValue();
        if (info.Length() > 3)
        {
            int dim = info[2]->Int32Value();
            return ArrayWrapper::NewAsync(info, [=]() { Guard guard; return new af::array(af::var(array, biased, dim)); });
        }
        else
        {
            if (NeedsDouble(array))
            {
                auto exec = [=]() { Guard guard; return af::var<double>(array, biased); };
                auto worker = new Worker<double>(GetCallback(info), std::move(exec));
                Nan::AsyncQueueWorker(worker);
                info.GetReturnValue().SetUndefined();
            }
            else
            {
                auto exec = [=]() { Guard guard; return af::var<float>(array, biased); };
                auto worker = new Worker<float>(GetCallback(info), std::move(exec));
                Nan::AsyncQueueWorker(worker);
                info.GetReturnValue().SetUndefined();
            }
        }
    }
    ARRAYFIRE_CATCH
}

ARRAYFIRE_ASYNC_METHOD_ALGO_V3(WeightedVar, var)

NAN_METHOD(CorrCoef)
{

    try
    {
        ARGS_LEN(3);

        auto array1 = *ArrayWrapper::GetArrayAt(info, 0);
        auto array2 = *ArrayWrapper::GetArrayAt(info, 1);
        if (NeedsDouble(array1))
        {
            auto exec = [=]() { Guard guard; return af::corrcoef<double>(array1, array2); };
            auto worker = new Worker<double>(GetCallback(info), std::move(exec));
            Nan::AsyncQueueWorker(worker);
            info.GetReturnValue().SetUndefined();
        }
        else
        {
            auto exec = [=]() { Guard guard; return af::corrcoef<float>(array1, array2); };
            auto worker = new Worker<float>(GetCallback(info), std::move(exec));
            Nan::AsyncQueueWorker(worker);
            info.GetReturnValue().SetUndefined();
        }
    }
    ARRAYFIRE_CATCH
}

NAN_MODULE_INIT(InitStatistics)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("cov").ToLocalChecked(), Nan::New<FunctionTemplate>(Cov)->GetFunction());
    Nan::Set(target, Nan::New<String>("mean").ToLocalChecked(), Nan::New<FunctionTemplate>(Mean)->GetFunction());
    Nan::Set(target, Nan::New<String>("weightedMean").ToLocalChecked(), Nan::New<FunctionTemplate>(Mean)->GetFunction());
    Nan::Set(target, Nan::New<String>("median").ToLocalChecked(), Nan::New<FunctionTemplate>(Median)->GetFunction());
    Nan::Set(target, Nan::New<String>("stdev").ToLocalChecked(), Nan::New<FunctionTemplate>(StDev)->GetFunction());
    Nan::Set(target, Nan::New<String>("stDev").ToLocalChecked(), Nan::New<FunctionTemplate>(StDev)->GetFunction());
    Nan::Set(target, Nan::New<String>("stdDev").ToLocalChecked(), Nan::New<FunctionTemplate>(StDev)->GetFunction());
    Nan::Set(target, Nan::New<String>("var").ToLocalChecked(), Nan::New<FunctionTemplate>(Var)->GetFunction());
    Nan::Set(target, Nan::New<String>("weightedVar").ToLocalChecked(), Nan::New<FunctionTemplate>(WeightedVar)->GetFunction());
    Nan::Set(target, Nan::New<String>("corrcoef").ToLocalChecked(), Nan::New<FunctionTemplate>(CorrCoef)->GetFunction());
    Nan::Set(target, Nan::New<String>("corrCoef").ToLocalChecked(), Nan::New<FunctionTemplate>(CorrCoef)->GetFunction());
}
