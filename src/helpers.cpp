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
#include "helpers.h"
#include "errors.h"
#include "arraywrapper.h"
#include "symbols.h"

using namespace std;
using namespace v8;
using namespace node;

pair<af::dtype, unsigned> GetDTypeInfo(unsigned udtype)
{
    unsigned sizeOf;
    af::dtype dtype;
    switch (udtype)
    {
        case 0:
            dtype = f32;
            sizeOf = 32 / 8;
            break;
        case 1:
            dtype = c32;
            sizeOf = 32 / 8;
            break;
        case 2:
            dtype = f64;
            sizeOf = 64 / 8;
            break;
        case 3:
            dtype = c64;
            sizeOf = 64 / 8;
            break;
        case 4:
            dtype = b8;
            sizeOf = 8 / 8;
            break;
        case 5:
            dtype = s32;
            sizeOf = 32 / 8;
            break;
        case 6:
            dtype = u32;
            sizeOf = 32 / 8;
            break;
        case 7:
            dtype = u8;
            sizeOf = 8 / 8;
            break;
        case 8:
            dtype = s64;
            sizeOf = 64 / 8;
            break;
        case 9:
            dtype = u64;
            sizeOf = 64 / 8;
            break;
        default:
            ARRAYFIRE_THROW("DType is out of range.");
    }
    return move(make_pair(dtype, sizeOf));
}

std::pair<af::dtype, unsigned> GetDTypeInfo(v8::Local<v8::Value> value)
{
    if (value->IsNumber())
    {
        return GetDTypeInfo(value->Uint32Value());
    }
    ARRAYFIRE_THROW("Value is not a number.");
}

string ErrToString(af_err err)
{
    switch (err)
    {
        case AF_ERR_INTERNAL:
            return "Internal error (AF_ERR_INTERNAL).";
            break;
        case AF_ERR_NO_MEM:
            return "Not enough memory error (AF_ERR_NO_MEM).";
            break;
        case AF_ERR_DRIVER:
            return "Driver error (AF_ERR_DRIVER).";
            break;
        case AF_ERR_RUNTIME:
            return "Runtime error (AF_ERR_RUNTIME).";
            break;
        case AF_ERR_INVALID_ARRAY:
            return "Invalid array error (AF_ERR_INVALID_ARRAY).";
            break;
        case AF_ERR_ARG:
            return "Argument error (AF_ERR_ARG).";
            break;
        case AF_ERR_SIZE:
            return "Size error (AF_ERR_SIZE).";
            break;
        case AF_ERR_DIFF_TYPE:
            return "Diff type error (AF_ERR_DIFF_TYPE).";
            break;
        case AF_ERR_NOT_SUPPORTED:
            return "Operation is not supported (AF_ERR_NOT_SUPPORTED).";
            break;
        case AF_ERR_NOT_CONFIGURED:
            return "Not configured error (AF_ERR_NOT_CONFIGURED).";
            break;
        default:
            return "Uknown ArrayFire error (AF_ERR_UNKNOWN).";
    };
}

v8::Local<v8::Object> WrapPointer(void* ptr)
{
    return NanNewBufferHandle(reinterpret_cast<char*>(ptr), 0, [](char*v1, void*v2) {}, nullptr);
}

af::dim4 ToDim4(v8::Local<v8::Object> obj)
{
    Local<Array> dims;
    if (obj->IsArray())
    {
        dims = obj.As<Array>();
    }
    else
    {
        auto member = obj->Get(NanNew(Symbols::Dims));
        if (member->IsArray())
        {
            dims = member.As<Array>();
        }
        else
        {
            ARRAYFIRE_THROW_ARG_IS_NOT_A_DIM4();
        }
    }
    int dim0 = 1;
    int dim1 = 1;
    int dim2 = 1;
    int dim3 = 1;
    if (dims->Length() > 0)
    {
        dim0 = dims->Get(0)->Uint32Value();
    }
    if (dims->Length() > 1)
    {
        dim1 = dims->Get(1)->Uint32Value();
    }
    if (dims->Length() > 2)
    {
        dim2 = dims->Get(2)->Uint32Value();
    }
    if (dims->Length() > 3)
    {
        dim3 = dims->Get(3)->Uint32Value();
    }
    return move(af::dim4(dim0, dim1, dim2, dim3));
}

af::dim4 ToDim4(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToDim4(value.As<Object>());
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

af::seq ToSeq(v8::Local<v8::Object> obj)
{
    auto begin = obj->Get(NanNew(Symbols::Begin));
    auto end = obj->Get(NanNew(Symbols::End));
    auto step = obj->Get(NanNew(Symbols::Step));
    auto isGFor = obj->Get(NanNew(Symbols::IsGFor));
    if (begin->IsNumber() && end->IsNumber())
    {
        double stepValue = 1;
        if (step->IsNumber())
        {
            stepValue = step->NumberValue();
        }
        bool isGForValue = false;
        if (isGFor->IsBoolean())
        {
            isGForValue = isGFor->BooleanValue();
        }
        if (isGForValue)
        {
            return move(af::seq(af::seq(begin->NumberValue(), end->NumberValue(), stepValue), isGForValue));
        }
        return move(af::seq(begin->NumberValue(), end->NumberValue(), stepValue));
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_A_SEQ();
}

af::seq ToSeq(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToSeq(value.As<Object>());
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

af::index ToIndex(v8::Local<v8::Value> value)
{
    if (value->IsNull())
    {
        return af::span;
    }
    if (value->IsNumber())
    {
        return af::index(value->Int32Value());
    }
    if (value->IsString())
    {
        String::Utf8Value str(value);
        if (strcmp(*str, "span") == 0)
        {
            return af::span;
        }
        else if (strcmp(*str, "end") == 0)
        {
            return af::end;
        }
    }
    if (value->IsObject())
    {
        auto pArray = ArrayWrapper::TryGetArray(value);
        if (pArray)
        {
            return af::index(*pArray);
        }
        return ToSeq(value.As<Object>());
    }    
    ARRAYFIRE_THROW_ARG_IS_NOT_AN_INDEX();
}

af::af_cdouble ToDComplex(v8::Local<v8::Object> obj)
{
    auto imag = obj->Get(NanNew(Symbols::Imag));
    auto real = obj->Get(NanNew(Symbols::Real));
    if (imag->IsNumber() && real->IsNumber())
    {
        return { real->NumberValue(), imag->NumberValue() };
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_A_CPLX();
}

af::af_cdouble ToDComplex(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToDComplex(value.As<Object>());
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

af::af_cfloat ToFComplex(v8::Local<v8::Object> obj)
{
    auto imag = obj->Get(NanNew(Symbols::Imag));
    auto real = obj->Get(NanNew(Symbols::Real));
    if (imag->IsNumber() && real->IsNumber())
    {
        return { (float)real->NumberValue(), (float)imag->NumberValue() };
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_A_CPLX();
}

af::af_cfloat ToFComplex(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToFComplex(value.As<Object>());
    }
    ARRAYFIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

v8::Local<v8::Object> ToV8Complex(const af::af_cdouble& value)
{
    auto obj = NanNew<Object>();
    obj->Set(NanNew(Symbols::Imag), NanNew(value.imag));
    obj->Set(NanNew(Symbols::Real), NanNew(value.real));
    return obj;
}

v8::Local<v8::Object> ToV8Complex(const af::af_cfloat& value)
{
    auto obj = NanNew<Object>();
    obj->Set(NanNew(Symbols::Imag), NanNew(value.imag));
    obj->Set(NanNew(Symbols::Real), NanNew(value.real));
    return obj;
}

std::pair<af::dim4, af::dtype> ParseDimAndTypeArgs(const v8::FunctionCallbackInfo<v8::Value>& args, int assumedArgsLength, int argsFollowingDims, int dimsStartAt)
{
    if (assumedArgsLength == -1)
    {
        assumedArgsLength = args.Length();
        if (args[assumedArgsLength - 1]->IsFunction())
        {
            // Async
            assumedArgsLength--;
        }
    }
    af::dim4 dims(1, 1, 1, 1);
    bool any = false;
    for (int idx = dimsStartAt; idx < ((assumedArgsLength - 1) - argsFollowingDims) + dimsStartAt; idx++)
    {
        int dimIdx = idx - dimsStartAt;
        assert(dimIdx < 4);
        any = true;
        if (dimIdx == 0 && args[0]->IsObject())
        {
            dims = move(ToDim4(args[0].As<Object>()));
            break;
        }
        dims[dimIdx] = args[idx]->Int32Value();
    }
    if (any)
    {
        af::dtype type = GetDTypeInfo(args[assumedArgsLength - 1 + dimsStartAt]->Uint32Value()).first;
        return move(make_pair(move(dims), type));
    }
    ARRAYFIRE_THROW("Cannot extract dimensions and dtype from argumens.");
}

NanCallback* GetCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() && args[args.Length() - 1]->IsFunction())
    {
        return new NanCallback(args[args.Length() - 1].As<Function>());
    }
    ARRAYFIRE_THROW_CB_EXPECTED();
}

v8::Local<v8::Object> ToV8Features(const af::features& feat)
{
    auto obj = NanNew<Object>();
    obj->Set(NanNew(Symbols::NumFeatures), NanNew((unsigned)feat.getNumFeatures()));
    obj->Set(NanNew(Symbols::X), ArrayWrapper::New(feat.getX()));
    obj->Set(NanNew(Symbols::Y), ArrayWrapper::New(feat.getY()));
    obj->Set(NanNew(Symbols::Score), ArrayWrapper::New(feat.getScore()));
    obj->Set(NanNew(Symbols::Orientation), ArrayWrapper::New(feat.getOrientation()));
    obj->Set(NanNew(Symbols::Size), ArrayWrapper::New(feat.getSize()));
    return obj;
}
