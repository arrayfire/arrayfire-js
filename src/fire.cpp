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
#include "fire.h"
#include "device.h"
#include "arraywrapper.h"
#include "createarray.h"
#include "moveandreorderarray.h"
#include "arrayhelperfunctions.h"
#include "mathfunctions.h"
#include "vectoralgorithms.h"
#include "statistics.h"
#include "symbols.h"

using namespace v8;
using namespace std;

NAN_METHOD(_DoEvents)
{
    NanScope();
    uv_run(uv_default_loop(), UV_RUN_ONCE);
    NanReturnUndefined();
}

void Init(v8::Handle<v8::Object> exports)
{
    Symbols::Init();
    InitDevice(exports);
    ArrayWrapper::Init(exports);
    InitCreateArray(exports);
    InitMoveAndReorderArray(exports);
    InitArrayHelperFunctions(exports);
    InitMathFunctions(exports);
    InitVectorAlgorithms(exports);
    InitStatistics(exports);

    // Helpers:
    exports->Set(NanNew("_doEvents"), NanNew<FunctionTemplate>(_DoEvents)->GetFunction());
}
