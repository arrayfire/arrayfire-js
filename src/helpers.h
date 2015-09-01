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

#ifndef ARRAYFIRE_JS_HELPERS_H
#define ARRAYFIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>
#include <nan.h>
#include <complex>
#include <functional>
#include "symbols.h"

enum class Region
{
    None, Row, Rows, Col, Cols, Slice, Slices
};

typedef std::tuple<Region, unsigned, unsigned> RegionIndex;

std::pair<af::dtype, unsigned> GetDTypeInfo(unsigned udtype);

std::pair<af::dtype, unsigned> GetDTypeInfo(v8::Local<v8::Value> value);

std::string ErrToString(af_err);

v8::Local<v8::Object> WrapPointer(void* ptr);

af::dim4 ToDim4(v8::Local<v8::Object> obj);

af::dim4 ToDim4(v8::Local<v8::Value> value);

af::seq ToSeq(v8::Local<v8::Object> obj);

af::seq ToSeq(v8::Local<v8::Value> value);

af::index ToIndex(v8::Local<v8::Value> value);

af::af_cdouble ToDComplex(v8::Local<v8::Object> obj);

af::af_cdouble ToDComplex(v8::Local<v8::Value> value);

af::af_cfloat ToFComplex(v8::Local<v8::Object> obj);

af::af_cfloat ToFComplex(v8::Local<v8::Value> value);

v8::Local<v8::Object> ToV8Complex(const af::af_cdouble& value);

v8::Local<v8::Object> ToV8Complex(const af::af_cfloat& value);

v8::Local<v8::Object> ToV8Features(const af::features& feat);

std::pair<af::dim4, af::dtype> ParseDimAndTypeArgs(const Nan::FunctionCallbackInfo<v8::Value>& info, int assumedArgsLength = -1, int argsFollowingDims = 0, int dimsStartAt = 0);

Nan::Callback* GetCallback(const Nan::FunctionCallbackInfo<v8::Value>& info);

inline bool NeedsDouble(const af::array& array) { return array.type() == f64 || array.type() == c64 || array.type() == s64 || array.type() == u64; }

inline bool NeedsDouble(const af::array::array_proxy& arrayProxy) { return arrayProxy.type() == f64 || arrayProxy.type() == c64 || arrayProxy.type() == s64 || arrayProxy.type() == u64; }

RegionIndex ToRegionIndex(v8::Local<v8::Object> obj);

RegionIndex ToRegionIndex(v8::Local<v8::Value> value);

#define ARGS_LEN(n) if (info.Length() < n) return NAN_THROW_INVALID_NO_OF_ARGS();

#define ARRAYFIRE_SYNC_METHOD_ARR(F, f)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0))));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_DIM(F, f)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        int dim = 0;\
        if (info.Length() > 1) dim = info[1]->Int32Value();\
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), dim)));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_BOOL(F, f, defV)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        bool v = defV;\
        if (info.Length() > 1) v = info[1]->BooleanValue();\
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), v)));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_VOID_ARR_BOOL(F, f, defV)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        bool v = defV;\
        if (info.Length() > 1) v = info[1]->BooleanValue();\
        Guard guard;\
        af::f(*ArrayWrapper::GetArrayAt(info, 0), v);\
        info.GetReturnValue().SetUndefined();\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_FLOAT_FLOAT_FLOAT(F, f, defV1, defV2, defV3)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        float v1 = defV1;\
        float v2 = defV2;\
        float v3 = defV3;\
        if (info.Length() > 1) v1 = info[1]->NumberValue();\
        if (info.Length() > 2) v1 = info[2]->NumberValue();\
        if (info.Length() > 3) v1 = info[3]->NumberValue();\
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), v1, v2, v3)));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_ARR(F, f)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), *ArrayWrapper::GetArrayAt(info, 1))));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_ARR_ARR(F, f)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), *ArrayWrapper::GetArrayAt(info, 1), *ArrayWrapper::GetArrayAt(info, 2))));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_ARR_ARR_ARR(F, f)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(4);\
        \
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), *ArrayWrapper::GetArrayAt(info, 1), *ArrayWrapper::GetArrayAt(info, 2), *ArrayWrapper::GetArrayAt(info, 3))));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_ARR_DIM(F, f)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        int dim = 0;\
        if (info.Length() > 2) dim = info[2]->Int32Value();\
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), *ArrayWrapper::GetArrayAt(info, 1), dim)));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_ARR_BOOL(F, f, defV)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        bool v = defV;\
        if (info.Length() > 2) v = info[2]->BooleanValue();\
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(info, 0), *ArrayWrapper::GetArrayAt(info, 1), v)));\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_ARR_DOUBLE_COMB(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2)\
        \
        auto pArray1 = ArrayWrapper::TryGetArrayAt(info, 0);\
        auto pArray2 = ArrayWrapper::TryGetArrayAt(info, 1);\
        Guard guard;\
        if (pArray1)\
        {\
            if (pArray2)\
            {\
                info.GetReturnValue().Set(ArrayWrapper::New(af::f(*pArray1, *pArray2)));\
                return;\
            }\
            else if (info[1]->IsNumber())\
            {\
                double d = info[1]->NumberValue();\
                if (NeedsDouble(*pArray1))\
                    info.GetReturnValue().Set(ArrayWrapper::New(af::f(*pArray1, d)));\
                else\
                    info.GetReturnValue().Set(ArrayWrapper::New(af::f(*pArray1, (float)d)));\
                return;\
            }\
        }\
        else if (info[0]->IsNumber())\
        {\
            double d = info[0]->NumberValue();\
            if (pArray2)\
            {\
                if (NeedsDouble(*pArray2))\
                    info.GetReturnValue().Set(ArrayWrapper::New(af::f(d, *pArray2)));\
                else\
                    info.GetReturnValue().Set(ArrayWrapper::New(af::f((float)d, *pArray2)));\
                return;\
            }\
        }\
        \
        NAN_THROW_INVALID_ARGS();\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_ASYNC_METHOD_ALGO_V1(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        auto array = *ArrayWrapper::GetArrayAt(info, 0);\
        if (info.Length() > 2)\
        {\
            int dim = info[1]->Int32Value();\
            return ArrayWrapper::NewAsync(info, [=]() { Guard guard; return new af::array(af::f(array, dim)); });\
        }\
        else\
        {\
            if (NeedsDouble(array))\
            {\
                auto exec = [=]() { Guard guard; return af::f<double>(array); };\
                auto worker = new Worker<double>(GetCallback(info), std::move(exec));\
                Nan::AsyncQueueWorker(worker);\
                info.GetReturnValue().SetUndefined();\
            }\
            else\
            {\
                auto exec = [=]() { Guard guard; return af::f<float>(array); };\
                auto worker = new Worker<float>(GetCallback(info), std::move(exec));\
                Nan::AsyncQueueWorker(worker);\
                info.GetReturnValue().SetUndefined();\
            }\
        }\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_ASYNC_METHOD_ALGO_V2(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        auto array = *ArrayWrapper::GetArrayAt(info, 0);\
        if (info.Length() > 2)\
        {\
            int dim = info[1]->Int32Value();\
            typedef std::pair<af::array, af::array> PairT;\
            typedef Worker<PairT> WorkerT;\
            auto exec = [=]()\
            {\
                Guard guard;\
                af::array v;\
                af::array at;\
                af::f(v, at, array, dim);\
                return make_pair(v, at);\
            };\
            auto conv = [=](WorkerT* w, PairT p)\
            {\
                Nan::EscapableHandleScope scope;\
                auto obj = Nan::New<Object>();\
                obj->Set(Nan::New(Symbols::Value), ArrayWrapper::New(p.first));\
                obj->Set(Nan::New(Symbols::Index), ArrayWrapper::New(p.second));\
                return scope.Escape(obj);\
            };\
            auto worker = new WorkerT(GetCallback(info), std::move(exec), std::move(conv));\
            Nan::AsyncQueueWorker(worker);\
            info.GetReturnValue().SetUndefined();\
        }\
        else\
        {\
            if (NeedsDouble(array))\
            {\
                typedef std::pair<double, unsigned> PairT;\
                typedef Worker<PairT> WorkerT;\
                auto exec = [=]()\
                {\
                    Guard guard;\
                    double v;\
                    unsigned at;\
                    af::f<double>(&v, &at, array);\
                    return make_pair(v, at);\
                };\
                auto conv = [=](WorkerT* w, PairT p)\
                {\
                    Nan::EscapableHandleScope scope;\
                    auto obj = Nan::New<Object>();\
                    obj->Set(Nan::New(Symbols::Value), Nan::New(p.first));\
                    obj->Set(Nan::New(Symbols::Index), Nan::New(p.second));\
                    return scope.Escape(obj);\
                };\
                auto worker = new WorkerT(GetCallback(info), std::move(exec), std::move(conv));\
                Nan::AsyncQueueWorker(worker);\
                info.GetReturnValue().SetUndefined();\
            }\
            else\
            {\
                typedef std::pair<float, unsigned> PairT;\
                typedef Worker<PairT> WorkerT;\
                auto exec = [=]()\
                {\
                    Guard guard;\
                    float v;\
                    unsigned at;\
                    af::f<float>(&v, &at, array);\
                    return make_pair(v, at);\
                };\
                auto conv = [=](WorkerT* w, PairT p)\
                {\
                    Nan::EscapableHandleScope scope;\
                    auto obj = Nan::New<Object>();\
                    obj->Set(Nan::New(Symbols::Value), Nan::New(p.first));\
                    obj->Set(Nan::New(Symbols::Index), Nan::New(p.second));\
                    return scope.Escape(obj);\
                };\
                auto worker = new WorkerT(GetCallback(info), std::move(exec), std::move(conv));\
                Nan::AsyncQueueWorker(worker);\
                info.GetReturnValue().SetUndefined();\
            }\
        }\
    }\
    ARRAYFIRE_CATCH\
}

// weighted mean like stuff:
#define ARRAYFIRE_ASYNC_METHOD_ALGO_V3(F, f)\
NAN_METHOD(F)\
{\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        auto array1 = *ArrayWrapper::GetArrayAt(info, 0);\
        auto array2 = *ArrayWrapper::GetArrayAt(info, 1);\
        if (info.Length() > 3)\
        {\
            int dim = info[2]->Int32Value();\
            return ArrayWrapper::NewAsync(info, [=]() { Guard guard; return new af::array(af::f(array1, array2, dim)); });\
        }\
        else\
        {\
            if (NeedsDouble(array1))\
            {\
                auto exec = [=]() { Guard guard; return af::f<double>(array1, array2); };\
                auto worker = new Worker<double>(GetCallback(info), std::move(exec));\
                Nan::AsyncQueueWorker(worker);\
                info.GetReturnValue().SetUndefined();\
            }\
            else\
            {\
                auto exec = [=]() { Guard guard; return af::f<float>(array1, array2); };\
                auto worker = new Worker<float>(GetCallback(info), std::move(exec));\
                Nan::AsyncQueueWorker(worker);\
                info.GetReturnValue().SetUndefined();\
            }\
        }\
    }\
    ARRAYFIRE_CATCH\
}

#define ARRAYFIRE_SYNC_METHOD_XYZW(F, f, iy, iz, iw)\
NAN_METHOD(F)\
{\
    \
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);\
        unsigned x, y, z, w;\
        if (info[1]->IsObject())\
        {\
            auto dim = ToDim4(info[1].As<Object>());\
            x = dim[0];\
            y = dim[1];\
            z = dim[2];\
            w = dim[3];\
        }\
        else\
        {\
            x = info[1]->Uint32Value();\
            y = iy;\
            z = iz;\
            w = iw;\
            if (info.Length() > 2)\
            {\
                y = info[2]->Uint32Value();\
            }\
            if (info.Length() > 3)\
            {\
                z = info[3]->Uint32Value();\
            }\
            if (info.Length() > 4)\
            {\
                w = info[4]->Uint32Value();\
            }\
        }\
        Guard guard;\
        info.GetReturnValue().Set(ArrayWrapper::New(af::f(*pArray, x, y, z, w)));\
    }\
    ARRAYFIRE_CATCH\
}

#endif // ARRAYFIRE_JS_HELPERS_H
