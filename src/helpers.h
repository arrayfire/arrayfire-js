/*
Copyright 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)

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

#ifndef FIRE_JS_HELPERS_H
#define FIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>
#include <nan.h>
#include <complex>
#include <functional>
#include "symbols.h"

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

af::af_cdouble  ToDComplex(v8::Local<v8::Value> value);

af::af_cfloat  ToFComplex(v8::Local<v8::Object> obj);

af::af_cfloat ToFComplex(v8::Local<v8::Value> value);

v8::Local<v8::Object> ToV8Complex(const af::af_cdouble& value);

v8::Local<v8::Object> ToV8Complex(const af::af_cfloat& value);

std::pair<af::dim4, af::dtype> ParseDimAndTypeArgs(const v8::FunctionCallbackInfo<v8::Value>& args, int assumedArgsLength = -1, int argsFollowingDims = 0, int dimsStartAt = 0);

NanCallback* GetCallback(const v8::FunctionCallbackInfo<v8::Value>& args);

inline bool NeedsDouble(const af::array& array) { return array.type() == f64 || array.type() == c64 || array.type() == s64 || array.type() == u64; }

inline bool NeedsDouble(const af::array::array_proxy& arrayProxy) { return arrayProxy.type() == f64 || arrayProxy.type() == c64 || arrayProxy.type() == s64 || arrayProxy.type() == u64; }

#define ARGS_LEN(n) if (args.Length() < n) return NAN_THROW_INVALID_NO_OF_ARGS();

#define FIRE_SYNC_METHOD_ARR(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        Guard();\
        NanReturnValue(ArrayWrapper::New(af::f(*ArrayWrapper::GetArrayAt(args, 0))));\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_DIM(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        af::array array = *ArrayWrapper::GetArrayAt(args, 0);\
        int dim = 0;\
        if (args.Length() > 2) dim = args[1]->Int32Value();\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array, dim))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_BOOL(F, f, defV)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(2);\
        \
        af::array array = *ArrayWrapper::GetArrayAt(args, 0);\
        bool v = defV;\
        if (args.Length() > 2) v = args[1]->BooleanValue();\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array, v))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_ARR(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 0);\
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 1);\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array1, array2))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_ARR_DIM(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 0);\
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 1);\
        int dim = 0;\
        if (args.Length() > 3) dim = args[2]->Int32Value();\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array1, array2, dim))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_ARR_BOOL(F, f, defV)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 0);\
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 1);\
        bool v = defV;\
        if (args.Length() > 3) v = args[2]->BooleanValue();\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(std::move(af::f(array1, array2, v))); });\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ARR_DOUBLE_COMB(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(3)\
        \
        auto pArray1 = ArrayWrapper::TryGetArrayAt(args, 0);\
        auto pArray2 = ArrayWrapper::TryGetArrayAt(args, 1);\
        if (pArray1)\
        {\
            auto array1 = *pArray1;\
            if (pArray2)\
            {\
                auto array2 = *pArray2;\
                return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(array1, array2)); });\
            }\
            else if (args[1]->IsNumber())\
            {\
                double d = args[1]->NumberValue();\
                return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(array1, d)); });\
            }\
        }\
        else if (args[0]->IsNumber())\
        {\
            double d = args[0]->NumberValue();\
            if (pArray2)\
            {\
                auto array2 = *pArray2;\
                return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(d, array2)); });\
            }\
        }\
        \
        NAN_THROW_INVALID_ARGS();\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ALGO_V1(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(2);\
        \
        auto array = *ArrayWrapper::GetArrayAt(args, 0);\
        if (args.Length() > 2)\
        {\
            int dim = args[1]->Int32Value();\
            return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(array, dim)); });\
        }\
        else\
        {\
            if (NeedsDouble(array))\
            {\
                auto exec = [=]() { Guard(); return af::f<double>(array); };\
                auto worker = new Worker<double>(GetCallback(args), std::move(exec));\
                NanAsyncQueueWorker(worker);\
                NanReturnUndefined();\
            }\
            else\
            {\
                auto exec = [=]() { Guard(); return af::f<float>(array); };\
                auto worker = new Worker<float>(GetCallback(args), std::move(exec));\
                NanAsyncQueueWorker(worker);\
                NanReturnUndefined();\
            }\
        }\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_ALGO_V2(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(2);\
        \
        auto array = *ArrayWrapper::GetArrayAt(args, 0);\
        if (NeedsDouble(array))\
        {\
            typedef std::pair<double, unsigned> PairT;\
            typedef Worker<PairT> WorkerT;\
            auto exec = [=]()\
            {\
                Guard();\
                double v;\
                unsigned at;\
                af::f<double>(&v, &at, array);\
                return make_pair(v, at);\
            };\
            auto conv = [=](WorkerT* w, PairT p)\
            {\
                auto obj = NanNew<Object>();\
                obj->Set(NanNew(Symbols::Value), NanNew(p.first));\
                obj->Set(NanNew(Symbols::Index), NanNew(p.second));\
                return obj;\
            };\
            auto worker = new WorkerT(GetCallback(args), std::move(exec), std::move(conv));\
            NanAsyncQueueWorker(worker);\
            NanReturnUndefined();\
        }\
        else\
        {\
            typedef std::pair<float, unsigned> PairT;\
            typedef Worker<PairT> WorkerT;\
            auto exec = [=]()\
            {\
                Guard();\
                float v;\
                unsigned at;\
                af::f<float>(&v, &at, array);\
                return make_pair(v, at);\
            };\
            auto conv = [=](WorkerT* w, PairT p)\
            {\
                auto obj = NanNew<Object>();\
                obj->Set(NanNew(Symbols::Value), NanNew(p.first));\
                obj->Set(NanNew(Symbols::Index), NanNew(p.second));\
                return obj;\
            };\
            auto worker = new WorkerT(GetCallback(args), std::move(exec), std::move(conv));\
            NanAsyncQueueWorker(worker);\
            NanReturnUndefined();\
        }\
    }\
    FIRE_CATCH\
}

// weighted mean like stuff:
#define FIRE_ASYNC_METHOD_ALGO_V3(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    try\
    {\
        ARGS_LEN(3);\
        \
        auto array1 = *ArrayWrapper::GetArrayAt(args, 0);\
        auto array2 = *ArrayWrapper::GetArrayAt(args, 1);\
        if (args.Length() > 3)\
        {\
            int dim = args[2]->Int32Value();\
            return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(af::f(array1, array2, dim)); });\
        }\
        else\
        {\
            if (NeedsDouble(array1))\
            {\
                auto exec = [=]() { Guard(); return af::f<double>(array1, array2); };\
                auto worker = new Worker<double>(GetCallback(args), std::move(exec));\
                NanAsyncQueueWorker(worker);\
                NanReturnUndefined();\
            }\
            else\
            {\
                auto exec = [=]() { Guard(); return af::f<float>(array1, array2); };\
                auto worker = new Worker<float>(GetCallback(args), std::move(exec));\
                NanAsyncQueueWorker(worker);\
                NanReturnUndefined();\
            }\
        }\
    }\
    FIRE_CATCH\
}

#define FIRE_ASYNC_METHOD_XYZW(F, f, iy, iz, iw)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(3);\
        \
        af::array array = *ArrayWrapper::GetArrayAt(args, 0);\
        unsigned x, y, z, w;\
        if (args[1]->IsObject())\
        {\
            auto dim = ToDim4(args[1].As<Object>());\
            x = dim[0];\
            y = dim[1];\
            z = dim[2];\
            w = dim[3];\
        }\
        else\
        {\
            x = args[1]->Uint32Value();\
            y = iy;\
            z = iz;\
            w = iw;\
            if (args.Length() > 2)\
            {\
                y = args[2]->Uint32Value();\
            }\
            if (args.Length() > 3)\
            {\
                z = args[3]->Uint32Value();\
            }\
            if (args.Length() > 4)\
            {\
                w = args[4]->Uint32Value();\
            }\
        }\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::f(array, x, y, z, w))); });\
    }\
    FIRE_CATCH\
}

#endif // FIRE_JS_HELPERS_H
