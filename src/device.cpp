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

    try
    {
        Guard guard;
#ifdef CPU
        info.GetReturnValue().Set(Nan::New<Number>(1));
#else
        info.GetReturnValue().Set(Nan::New<Number>(af::getDeviceCount()));
#endif
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(GetDevice)
{
    try
    {
        Guard guard;


#ifdef CPU
        info.GetReturnValue().Set(Nan::New<Number>(0));
#else
        info.GetReturnValue().Set(Nan::New<Number>(af::getDevice()));
#endif
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(SetDevice)
{


    try
    {
        Guard guard;

#ifndef CPU
        af::setDevice(info[0]->Uint32Value());
#endif

        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(DeviceInfo)
{


    try
    {
        Guard guard;

        bool IsDoubleAvailable = af::isDoubleAvailable(af::getDevice());
        auto infoObj = Nan::New<Object>();

#ifdef CPU
        infoObj->Set(Nan::New(Symbols::Name), Nan::New(Symbols::Cpu));
        infoObj->Set(Nan::New(Symbols::Platform), Nan::New(Symbols::Cpu));
        infoObj->Set(Nan::New(Symbols::Toolkit), Nan::New(Symbols::Cpu));
        infoObj->Set(Nan::New(Symbols::Compute), Nan::New(Symbols::Cpu));
        infoObj->Set(Nan::New(Symbols::IsDoubleAvailable), Nan::New<Boolean>(IsDoubleAvailable));
#else
        char name[256], platform[256], toolkit[256], compute[256];
        af::deviceInfo(name, platform, toolkit, compute);
        infoObj->Set(Nan::New(Symbols::Name), Nan::New<String>(name).ToLocalChecked());
        infoObj->Set(Nan::New(Symbols::Platform), Nan::New<String>(platform).ToLocalChecked());
        infoObj->Set(Nan::New(Symbols::Toolkit), Nan::New<String>(toolkit).ToLocalChecked());
        infoObj->Set(Nan::New(Symbols::Compute), Nan::New<String>(compute).ToLocalChecked());
        infoObj->Set(Nan::New(Symbols::IsDoubleAvailable), Nan::New<Boolean>(IsDoubleAvailable));
#endif

        info.GetReturnValue().Set(infoObj);
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(IsDoubleAvailable)
{


    try
    {
        Guard guard;

        info.GetReturnValue().Set(Nan::New<Number>(af::isDoubleAvailable(info[0]->Uint32Value())));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Sync)
{


    try
    {
        int device = -1;
        Nan::Callback *callback = nullptr;

        if (info.Length() > 0)
        {
            int idx = 0;
            if (info[idx]->IsNumber())
            {
                device = info[idx++]->Int32Value();
#ifdef CPU
                if (device > 1 || device < -1)
                {
                    return Nan::ThrowRangeError("Device is out of range.");
                }
#else
                if (device >= af::getDeviceCount() || device < -1)
                {
                    return Nan::ThrowRangeError("Device is out of range.");
                }
#endif
            }
            if (idx < info.Length() && info[idx]->IsFunction())
            {
                callback = new Nan::Callback(info[idx].As<Function>());
            }
        }

        auto exec = [=]()
        {
            Guard guard;
            af::sync(device);
        };

        Nan::AsyncQueueWorker(new Worker<void>(callback, move(exec)));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
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


    try
    {
        unsigned elements = info[0]->Uint32Value();
        unsigned udtype = info[1]->Uint32Value();
        auto allocPars = getAllocPars(elements, udtype);

        Guard guard;
        char* ptr = (char*)af::alloc(elements, allocPars.first);
        auto gcCallback = [](char* data, void* hint)
        {
            Guard guard;
            af::free(data);
            Nan::AdjustExternalMemory(static_cast<int>(reinterpret_cast<size_t>(hint)));
        };
        size_t size = elements + 100;
        Nan::AdjustExternalMemory(static_cast<int>(size));
        info.GetReturnValue().Set(Nan::NewBuffer(ptr, 0, gcCallback, reinterpret_cast<void*>(size)).ToLocalChecked());
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Pinned)
{


    try
    {
        unsigned elements = info[0]->Uint32Value();
        unsigned udtype = info[1]->Uint32Value();
        auto allocPars = getAllocPars(elements, udtype);

        Guard guard;
        char* ptr = (char*)af::pinned(elements, allocPars.first);
        auto gcCallback = [](char* data, void* hint)
        {
            Guard guard;
            af::freePinned(data);
            Nan::AdjustExternalMemory(static_cast<int>(reinterpret_cast<size_t>(hint)));
        };
        size_t size = elements + 100;
        Nan::AdjustExternalMemory(static_cast<int>(size));
        info.GetReturnValue().Set(Nan::NewBuffer(ptr, allocPars.second, gcCallback, reinterpret_cast<void*>(size)).ToLocalChecked());
    }
    ARRAYFIRE_CATCH
}

NAN_MODULE_INIT(InitDevice)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("getDeviceCount").ToLocalChecked(), Nan::New<FunctionTemplate>(GetDeviceCount)->GetFunction());
    Nan::Set(target, Nan::New<String>("getDevice").ToLocalChecked(), Nan::New<FunctionTemplate>(GetDevice)->GetFunction());
    Nan::Set(target, Nan::New<String>("setDevice").ToLocalChecked(), Nan::New<FunctionTemplate>(SetDevice)->GetFunction());
    Nan::Set(target, Nan::New<String>("deviceInfo").ToLocalChecked(), Nan::New<FunctionTemplate>(DeviceInfo)->GetFunction());
    Nan::Set(target, Nan::New<String>("isDoubleAvailable").ToLocalChecked(), Nan::New<FunctionTemplate>(IsDoubleAvailable)->GetFunction());
    Nan::Set(target, Nan::New<String>("sync").ToLocalChecked(), Nan::New<FunctionTemplate>(Sync)->GetFunction());
    Nan::Set(target, Nan::New<String>("wait").ToLocalChecked(), Nan::New<FunctionTemplate>(Sync)->GetFunction());
    Nan::Set(target, Nan::New<String>("alloc").ToLocalChecked(), Nan::New<FunctionTemplate>(Alloc)->GetFunction());
    Nan::Set(target, Nan::New<String>("pinned").ToLocalChecked(), Nan::New<FunctionTemplate>(Pinned)->GetFunction());
}
