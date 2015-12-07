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
#include "computervision.h"
#include "imageprocessing.h"
#include "linearalgebra.h"
#include "signalprocessing.h"
#include "errors.h"

using namespace v8;
using namespace std;

NAN_METHOD(_DoEvents)
{

    uv_run(uv_default_loop(), UV_RUN_ONCE);
    info.GetReturnValue().SetUndefined();
}

NAN_METHOD(_GforToggle)
{

    af::gforToggle();
    info.GetReturnValue().SetUndefined();
}

NAN_METHOD(GC)
{

    unsigned ms = info.Length() ? info[0]->Uint32Value() : 1000;
    Nan::IdleNotification(ms);
    try
    {
        af::sync();
    }
    ARRAYFIRE_CATCH
    info.GetReturnValue().SetUndefined();
}

NAN_MODULE_INIT(Init)
{
    Nan::HandleScope scope;

    Symbols::Init();
    InitDevice(target);
    ArrayWrapper::Init(target);
    InitCreateArray(target);
    InitMoveAndReorderArray(target);
    InitArrayHelperFunctions(target);
    InitMathFunctions(target);
    InitVectorAlgorithms(target);
    InitStatistics(target);
    InitComputerVision(target);
    InitImageProcessing(target);
    InitLinearAlgebra(target);
    InitSignalProcessing(target);

    // Helpers:
    Nan::Set(target, Nan::New<String>("_doEvents").ToLocalChecked(),
        Nan::New<FunctionTemplate>(_DoEvents)->GetFunction());

    Nan::Set(target, Nan::New<String>("_gforToggle").ToLocalChecked(),
        Nan::New<FunctionTemplate>(_GforToggle)->GetFunction());

    Nan::Set(target, Nan::New<String>("gc").ToLocalChecked(),
        Nan::New<FunctionTemplate>(::GC)->GetFunction());
}
