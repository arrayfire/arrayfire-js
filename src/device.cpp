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
#include "device.h"
#include "guard.h"
#include "worker.h"
#include "helpers.h"
#include "errors.h"
#include "symbols.h"

using namespace v8;
using namespace std;
using namespace node;


NAN_METHOD(GetDeviceCount)
{
    NanScope();
    try
    {
        Guard();
#ifdef CPU
        NanReturnValue(NanNew<Number>(1));
#else
        NanReturnValue(NanNew<Number>(af::getDeviceCount()));
#endif
    }
    FIRE_CATCH
}

NAN_METHOD(GetDevice)
{
    try
    {
        Guard();
        NanScope();

#ifdef CPU
        NanReturnValue(NanNew<Number>(0));
#else
        NanReturnValue(NanNew<Number>(af::getDevice()));
#endif
    }
    FIRE_CATCH
}

NAN_METHOD(SetDevice)
{
    NanScope();

    try
    {
        Guard();

#ifndef CPU
        af::setDevice(args[0]->Uint32Value());
#endif

        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(DeviceInfo)
{
    NanScope();

    try
    {
        Guard();

        bool IsDoubleAvailable = af::isDoubleAvailable(af::getDevice());
        auto info = NanNew<Object>();

#ifdef CPU
        info->Set(NanNew(Symbols::Name), NanNew(Symbols::Cpu));
        info->Set(NanNew(Symbols::Platform), NanNew(Symbols::Cpu));
        info->Set(NanNew(Symbols::Toolkit), NanNew(Symbols::Cpu));
        info->Set(NanNew(Symbols::Compute), NanNew(Symbols::Cpu));
        info->Set(NanNew(Symbols::IsDoubleAvailable), NanNew<Boolean>(IsDoubleAvailable));
#else
        char name[256], platform[256], toolkit[256], compute[256];
        af::deviceInfo(name, platform, toolkit, compute);
        info->Set(NanNew(Symbols::Name), NanNew<String>(name));
        info->Set(NanNew(Symbols::Platform), NanNew<String>(platform));
        info->Set(NanNew(Symbols::Toolkit), NanNew<String>(toolkit));
        info->Set(NanNew(Symbols::Compute), NanNew<String>(compute));
        info->Set(NanNew(Symbols::IsDoubleAvailable), NanNew<Boolean>(IsDoubleAvailable));
#endif

        NanReturnValue(info);
    }
    FIRE_CATCH
}

NAN_METHOD(IsDoubleAvailable)
{
    NanScope();

    try
    {
        Guard();

        NanReturnValue(NanNew<Number>(af::isDoubleAvailable(args[0]->Uint32Value())));
    }
    FIRE_CATCH
}

NAN_METHOD(Sync)
{
    NanScope();

    try
    {
        int device = -1;
        NanCallback *callback = nullptr;

        if (args.Length() > 0)
        {
            int idx = 0;
            if (args[idx]->IsNumber())
            {
                device = args[idx++]->Int32Value();
#ifdef CPU
                if (device > 1 || device < -1)
                {
                    return NanThrowRangeError("Device is out of range.");
                }
#else
                if (device >= af::getDeviceCount() || device < -1)
                {
                    return NanThrowRangeError("Device is out of range.");
                }
#endif
            }
            if (idx < args.Length() && args[idx]->IsFunction())
            {
                callback = new NanCallback(args[idx].As<Function>());
            }
        }

        auto exec = [=]()
        {
            Guard();
            af::sync(device);
        };

        NanAsyncQueueWorker(new Worker<void>(callback, move(exec)));
        NanReturnUndefined();
    }
    FIRE_CATCH
}

pair<af::dtype, unsigned> getAllocPars(unsigned elements, unsigned udtype)
{
    auto dtypeInfo = GetDTypeInfo(udtype);
    unsigned sizeOf = dtypeInfo.second;
    af::dtype dtype = dtypeInfo.first;
    unsigned size = sizeOf * elements;
    return move(make_pair(dtype, size));
}

NAN_METHOD(Alloc)
{
    NanScope();

    try
    {
        unsigned elements = args[0]->Uint32Value();
        unsigned udtype = args[1]->Uint32Value();
        auto allocPars = getAllocPars(elements, udtype);

        Guard();
        char* ptr = (char*)af::alloc(elements, allocPars.first);
        auto gcCallback = [](char* data, void* hint)
        {
            af::free(data);
        };

        NanReturnValue(NanNewBufferHandle(ptr, 0, gcCallback, nullptr));
    }
    FIRE_CATCH
}

NAN_METHOD(Pinned)
{
    NanScope();

    try
    {
        unsigned elements = args[0]->Uint32Value();
        unsigned udtype = args[1]->Uint32Value();
        auto allocPars = getAllocPars(elements, udtype);

        Guard();
        char* ptr = (char*)af::pinned(elements, allocPars.first);
        auto gcCallback = [](char* data, void* hint)
        {
            af::freePinned(data);
        };

        NanReturnValue(NanNewBufferHandle(ptr, allocPars.second, gcCallback, nullptr));
    }
    FIRE_CATCH
}

void InitDevice(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("getDeviceCount"), NanNew<FunctionTemplate>(GetDeviceCount)->GetFunction());
    exports->Set(NanNew("getDevice"), NanNew<FunctionTemplate>(GetDevice)->GetFunction());
    exports->Set(NanNew("setDevice"), NanNew<FunctionTemplate>(SetDevice)->GetFunction());
    exports->Set(NanNew("deviceInfo"), NanNew<FunctionTemplate>(DeviceInfo)->GetFunction());
    exports->Set(NanNew("isDoubleAvailable"), NanNew<FunctionTemplate>(IsDoubleAvailable)->GetFunction());
    exports->Set(NanNew("sync"), NanNew<FunctionTemplate>(Sync)->GetFunction());
    exports->Set(NanNew("wait"), NanNew<FunctionTemplate>(Sync)->GetFunction());
    exports->Set(NanNew("alloc"), NanNew<FunctionTemplate>(Alloc)->GetFunction());
    exports->Set(NanNew("pinned"), NanNew<FunctionTemplate>(Pinned)->GetFunction());
}
