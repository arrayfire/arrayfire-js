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
#include "createarray.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

NAN_METHOD(RandU)
{


    try
    {
        ARGS_LEN(2);
        auto dimAndType = ParseDimAndTypeArgs(info);
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::randu(dimAndType.first, dimAndType.second)));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(RandN)
{


    try
    {
        ARGS_LEN(2);
        auto dimAndType = ParseDimAndTypeArgs(info);
        if (dimAndType.second == f32 || dimAndType.second == f64)
        {
            Guard guard;
            info.GetReturnValue().Set(ArrayWrapper::New(af::randn(dimAndType.first, dimAndType.second)));
            return;
        }
        return NAN_THROW_INVALID_DTYPE();
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Identity)
{


    try
    {
        ARGS_LEN(2);
        auto dimAndType = ParseDimAndTypeArgs(info);
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::identity(dimAndType.first, dimAndType.second)));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Range)
{


    try
    {
        ARGS_LEN(3);
        auto dimAndType = ParseDimAndTypeArgs(info, -1, 1);
        af_dtype seqDim = (af_dtype)info[info.Length() - 2]->Uint32Value();
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::range(dimAndType.first, seqDim, dimAndType.second)));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Iota)
{


    try
    {
        ARGS_LEN(3);
        auto dims = ToDim4(info[0]);
        auto titleDims = ToDim4(info[1]);
        auto type = GetDTypeInfo(info[3]->Uint32Value());
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::iota(dims, titleDims, type.first)));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Diag)
{


    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        int num = 0;
        bool extract = true;
        if (info.Length() > 1)
        {
            num = info[1]->Int32Value();
        }
        if (info.Length() > 2)
        {
            extract = info[2]->BooleanValue();
        }
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::diag(*pArray, num, extract)));
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Constant)
{


    // Notice: In v8 we can go for double, complex, and int64 as a string, because v8 numbers are doubles.

    try
    {
        ARGS_LEN(3);
        auto dimAndType = ParseDimAndTypeArgs(info, -1, 0, 1);
        auto value = info[0];
        Guard guard;
        if (value->IsNumber())
        {
            double v = value->NumberValue();
            switch (dimAndType.second)
            {
                case f32:
                    info.GetReturnValue().Set(ArrayWrapper::New(af::constant<float>(v, dimAndType.first, dimAndType.second)));
                    return;
                case f64:
                    info.GetReturnValue().Set(ArrayWrapper::New(af::constant<double>(v, dimAndType.first, dimAndType.second)));
                    return;
                case s32:
                    info.GetReturnValue().Set(ArrayWrapper::New(af::constant<int>(v, dimAndType.first, dimAndType.second)));
                    return;
                case u32:
                    info.GetReturnValue().Set(ArrayWrapper::New(af::constant<unsigned>(v, dimAndType.first, dimAndType.second)));
                    return;
                case u8:
                    info.GetReturnValue().Set(ArrayWrapper::New(af::constant<unsigned char>(v, dimAndType.first, dimAndType.second)));
                    return;
                case b8:
                    info.GetReturnValue().Set(ArrayWrapper::New(af::constant<char>(v, dimAndType.first, dimAndType.second)));
                    return;
                default:
                    break;
            }
        }
        else if (value->IsObject())
        {
            switch (dimAndType.second)
            {
                case c32:
                    {
                        auto cv = ToFComplex(value.As<Object>());
                        info.GetReturnValue().Set(ArrayWrapper::New(af::constant<af::cfloat>(cv, dimAndType.first, dimAndType.second)));
                        return;
                    }
                case c64:
                    {
                        auto cv = ToDComplex(value.As<Object>());
                        info.GetReturnValue().Set(ArrayWrapper::New(af::constant<af::cdouble>(cv, dimAndType.first, dimAndType.second)));
                        return;
                    }
                default:
                    break;
            }
        }
        else if (value->IsString())
        {
            String::Utf8Value str(value);
            switch (dimAndType.second)
            {
                case s64:
                    {
                        long long val = strtoll(*str, nullptr, 10);
                        info.GetReturnValue().Set(ArrayWrapper::New(af::constant<long long>(val, dimAndType.first, dimAndType.second)));
                        return;
                    }
                case u64:
                    {
                        unsigned long long val = strtoll(*str, nullptr, 10);
                        info.GetReturnValue().Set(ArrayWrapper::New(af::constant<unsigned long long>(val, dimAndType.first, dimAndType.second)));
                        return;
                    }
                default:
                    break;
            }
        }
        else
        {
            ARRAYFIRE_THROW("Argument at position 0 is not a constant.");
        }
        ARRAYFIRE_THROW("Type is unknown.");
    }
    ARRAYFIRE_CATCH
}

AF_SM_ARR_BOOL(Lower, lower, false)
AF_SM_ARR_BOOL(Upper, upper, false)

NAN_METHOD(GetSeed)
{

    try
    {
        info.GetReturnValue().Set(Nan::New(to_string(af::getSeed()).c_str()).ToLocalChecked());
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(SetSeed)
{

    try
    {
        ARGS_LEN(1);
        if (info[0]->IsNumber())
        {
            long long seed = info[0]->NumberValue();
            af::setSeed(seed);
        }
        else if (info[0]->IsString())
        {
            String::Utf8Value str(info[0]);
            long long seed = strtoll(*str, nullptr, 10);
            af::setSeed(seed);
        }
        else
        {
            return NAN_THROW_INVALID_ARGS();
        }
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

AF_SM_ARR_ARR_DIM(Lookup, lookup)

NAN_MODULE_INIT(InitCreateArray)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("randu").ToLocalChecked(), Nan::New<FunctionTemplate>(RandU)->GetFunction());
    Nan::Set(target, Nan::New<String>("randU").ToLocalChecked(), Nan::New<FunctionTemplate>(RandU)->GetFunction());
    Nan::Set(target, Nan::New<String>("randn").ToLocalChecked(), Nan::New<FunctionTemplate>(RandN)->GetFunction());
    Nan::Set(target, Nan::New<String>("randN").ToLocalChecked(), Nan::New<FunctionTemplate>(RandN)->GetFunction());
    Nan::Set(target, Nan::New<String>("identity").ToLocalChecked(), Nan::New<FunctionTemplate>(Identity)->GetFunction());
    Nan::Set(target, Nan::New<String>("range").ToLocalChecked(), Nan::New<FunctionTemplate>(Range)->GetFunction());
    Nan::Set(target, Nan::New<String>("iota").ToLocalChecked(), Nan::New<FunctionTemplate>(Iota)->GetFunction());
    Nan::Set(target, Nan::New<String>("diag").ToLocalChecked(), Nan::New<FunctionTemplate>(Diag)->GetFunction());
    Nan::Set(target, Nan::New<String>("constant").ToLocalChecked(), Nan::New<FunctionTemplate>(Constant)->GetFunction());
    Nan::Set(target, Nan::New<String>("lower").ToLocalChecked(), Nan::New<FunctionTemplate>(Lower)->GetFunction());
    Nan::Set(target, Nan::New<String>("upper").ToLocalChecked(), Nan::New<FunctionTemplate>(Upper)->GetFunction());
    Nan::Set(target, Nan::New<String>("getSeed").ToLocalChecked(), Nan::New<FunctionTemplate>(GetSeed)->GetFunction());
    Nan::Set(target, Nan::New<String>("setSeed").ToLocalChecked(), Nan::New<FunctionTemplate>(SetSeed)->GetFunction());
    Nan::Set(target, Nan::New<String>("lookup").ToLocalChecked(), Nan::New<FunctionTemplate>(Lookup)->GetFunction());
}
