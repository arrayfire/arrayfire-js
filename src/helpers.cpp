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
#include "helpers.h"
#include "errors.h"
#include "arraywrapper.h"

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
            FIRE_THROW("DType is out of range.");
    }
    return move(make_pair(dtype, sizeOf));
}

std::pair<af::dtype, unsigned> GetDTypeInfo(v8::Local<v8::Value> value)
{
    if (value->IsNumber())
    {
        return GetDTypeInfo(value->Uint32Value());
    }
    FIRE_THROW("Value is not a number.");
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
        auto member = obj->Get(NanNew("dims")); // TODO: Create symbol table on init
        if (member->IsArray())
        {
            dims = member.As<Array>();
        }
        else
        {
            FIRE_THROW_ARG_IS_NOT_A_DIM4();
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
    FIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

af::seq ToSeq(v8::Local<v8::Object> obj)
{
    auto begin = obj->Get(NanNew("begin")); // TODO: Create symbol table on init
    auto end = obj->Get(NanNew("end")); // TODO: Create symbol table on init
    auto step = obj->Get(NanNew("step")); // TODO: Create symbol table on init
    auto isGFor = obj->Get(NanNew("isGFor")); // TODO: Create symbol table on init
    if (begin->IsNumber() && begin->IsNumber())
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
    FIRE_THROW_ARG_IS_NOT_A_SEQ();
}

af::seq ToSeq(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToSeq(value.As<Object>());
    }
    FIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

af::index ToIndex(v8::Local<v8::Value> value)
{
    if (value->IsNumber())
    {
        return af::index(value->Uint32Value());
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
    if (value->IsString())
    {
        String::Utf8Value str(value);
        if (strcmp(*str, "span") == 0)
        {
            return af::span;
        }
    }
    if (value->IsNull())
    {
        return af::span;
    }
    FIRE_THROW_ARG_IS_NOT_AN_INDEX();
}

af::af_cdouble ToDComplex(v8::Local<v8::Object> obj)
{
    auto imag = obj->Get(NanNew("imag")); // TODO: Create symbol table on init
    auto real = obj->Get(NanNew("real")); // TODO: Create symbol table on init
    if (imag->IsNumber() && real->IsNumber())
    {
        return { real->NumberValue(), imag->NumberValue() };
    }
    FIRE_THROW_ARG_IS_NOT_A_CPLX();
}

af::af_cdouble ToDComplex(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToDComplex(value.As<Object>());
    }
    FIRE_THROW_ARG_IS_NOT_AN_OBJ();
}

af::af_cfloat ToFComplex(v8::Local<v8::Object> obj)
{
    auto imag = obj->Get(NanNew("imag")); // TODO: Create symbol table on init
    auto real = obj->Get(NanNew("real")); // TODO: Create symbol table on init
    if (imag->IsNumber() && real->IsNumber())
    {
        return { (float)real->NumberValue(), (float)imag->NumberValue() };
    }
    FIRE_THROW_ARG_IS_NOT_A_CPLX();
}

af::af_cfloat ToFComplex(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToFComplex(value.As<Object>());
    }
    FIRE_THROW_ARG_IS_NOT_AN_OBJ();
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
    FIRE_THROW("Cannot extract dimensions and dtype from argumens.");
}

NanCallback* GetCallback(const v8::FunctionCallbackInfo<v8::Value>& args)
{
    if (args.Length() && args[args.Length() - 1]->IsFunction())
    {
        return new NanCallback(args[args.Length() - 1].As<Function>());
    }
    FIRE_THROW_CB_EXPECTED();
}
