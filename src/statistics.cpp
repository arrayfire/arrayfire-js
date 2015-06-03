/*
Copyright 2015 Gábor Mező aka unbornchikken

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
FIRE_ASYNC_METHOD_VEC_V1(Mean, mean)
FIRE_ASYNC_METHOD_VEC_V1(Median, median)
FIRE_ASYNC_METHOD_VEC_V1(StDev, stdev)

// TODO: corrCoeff (complex stuff)
// TODO: weightedMean
// TODO: var

void InitStatistics(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("cov"), NanNew<FunctionTemplate>(Cov)->GetFunction());
    exports->Set(NanNew("mean"), NanNew<FunctionTemplate>(Mean)->GetFunction());
    exports->Set(NanNew("median"), NanNew<FunctionTemplate>(Median)->GetFunction());
    exports->Set(NanNew("stdev"), NanNew<FunctionTemplate>(StDev)->GetFunction());
    exports->Set(NanNew("stDev"), NanNew<FunctionTemplate>(StDev)->GetFunction());
    exports->Set(NanNew("stdDev"), NanNew<FunctionTemplate>(StDev)->GetFunction());
}
