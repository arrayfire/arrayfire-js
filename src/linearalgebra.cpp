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
#include "linearalgebra.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;
using namespace node;

NAN_METHOD(Dot)
{

    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        af::matProp optLhs = AF_MAT_NONE;
        af::matProp optRhs = AF_MAT_NONE;
        if (info.Length() > 2) optLhs = (af::matProp)info[2]->Uint32Value();
        if (info.Length() > 3) optRhs = (af::matProp)info[3]->Uint32Value();
        Guard guard;
        info.GetReturnValue().Set(ArrayWrapper::New(af::dot(*pArray1, *pArray2, optLhs, optRhs)));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(MatMul)
{

    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(info, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(info, 1);
        auto pArray3 = (info.Length() > 2) ? ArrayWrapper::TryGetArrayAt(info, 2) : nullptr;
        if (pArray3 == nullptr)
        {
            af::matProp optLhs = AF_MAT_NONE;
            af::matProp optRhs = AF_MAT_NONE;
            if (info.Length() > 2) optLhs = (af::matProp)info[2]->Uint32Value();
            if (info.Length() > 3) optRhs = (af::matProp)info[3]->Uint32Value();
            Guard guard;
            info.GetReturnValue().Set(ArrayWrapper::New(af::matmul(*pArray1, *pArray2, optLhs, optRhs)));
        }
        else
        {
            auto pArray4 = (info.Length() > 3) ? ArrayWrapper::TryGetArrayAt(info, 3) : nullptr;
            if (pArray4 == nullptr)
            {
                Guard guard;
                info.GetReturnValue().Set(ArrayWrapper::New(af::matmul(*pArray1, *pArray2, *pArray3)));
            }
            else
            {
                Guard guard;
                info.GetReturnValue().Set(ArrayWrapper::New(af::matmul(*pArray1, *pArray2, *pArray3, *pArray4)));
            }
        }
    }
    ARRAYFIRE_CATCH;
}


ARRAYFIRE_SYNC_METHOD_ARR_ARR(MatMulNT, matmulNT)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(MatMulTN, matmulTN)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(MatMulTT, matmulTT)

ARRAYFIRE_SYNC_METHOD_ARR_BOOL(Transpose, transpose, false)
ARRAYFIRE_SYNC_METHOD_VOID_ARR_BOOL(TransposeInPlace, transposeInPlace, false)

NAN_METHOD(Solve)
{

    try
    {
        ARGS_LEN(3);
        auto array1 = *ArrayWrapper::GetArrayAt(info, 0);
        auto array2 = *ArrayWrapper::GetArrayAt(info, 1);
        af::matProp options = AF_MAT_NONE;
        if (info.Length() > 2) options = (af::matProp)info[2]->Uint32Value();
        typedef Worker<af::array> worker_t;
        auto exec = [=]()
        {
            Guard guard;
            return af::solve(array1, array2, options);
        };
        auto conv = [=](worker_t* worker, const af::array& arr)
        {
            return ArrayWrapper::New(arr);
        };

        auto worker = new worker_t(GetCallback(info), std::move(exec), std::move(conv));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(SolveLU)
{

    try
    {
        ARGS_LEN(4);
        auto array1 = *ArrayWrapper::GetArrayAt(info, 0);
        auto array2 = *ArrayWrapper::GetArrayAt(info, 1);
        auto array3 = *ArrayWrapper::GetArrayAt(info, 2);
        af::matProp options = AF_MAT_NONE;
        if (info.Length() > 3) options = (af::matProp)info[3]->Uint32Value();
        typedef Worker<af::array> worker_t;
        auto exec = [=]()
        {
            Guard guard;
            return af::solveLU(array1, array2, array3, options);
        };
        auto conv = [=](worker_t* worker, const af::array& arr)
        {
            return ArrayWrapper::New(arr);
        };
        auto worker = new worker_t(GetCallback(info), std::move(exec), std::move(conv));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Cholesky)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        bool isUpper = true;
        if (info.Length() > 1) isUpper = info[1]->BooleanValue();
        typedef pair<af::array, int> ResultT;
        typedef Worker<ResultT> WorkerT;
        auto exec = [=]()
        {
            Guard guard;
            af::array out;
            int r = af::cholesky(out, array, isUpper);
            return move(make_pair(out, r));
        };
        auto conv = [=](WorkerT* w, ResultT v)
        {
            Nan::EscapableHandleScope scope;
            auto result = Nan::New<Object>();
            result->Set(Nan::New(Symbols::Result), ArrayWrapper::New(v.first));
            result->Set(Nan::New(Symbols::FailedAtRank), Nan::New(v.second));
            return scope.Escape(result);
        };
        Nan::AsyncQueueWorker(new WorkerT(GetCallback(info), move(exec), move(conv)));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(CholeskyInPlace)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        bool isUpper = true;
        if (info.Length() > 1) isUpper = info[1]->BooleanValue();
        Nan::AsyncQueueWorker(new Worker<int>(GetCallback(info), [=]() mutable { Guard guard; return af::choleskyInPlace(array, isUpper); }));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(LuPacked)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        bool isLapackPiv = true;
        if (info.Length() > 1) isLapackPiv = info[1]->BooleanValue();
        typedef pair<af::array, af::array> ResultT;
        typedef Worker<ResultT> WorkerT;
        auto exec = [=]()
        {
            Guard guard;
            af::array out, pivot;
            af::lu(out, pivot, array, isLapackPiv);
            return move(make_pair(out, pivot));
        };
        auto conv = [=](WorkerT* w, ResultT v)
        {
            Nan::EscapableHandleScope scope;
            auto result = Nan::New<Object>();
            result->Set(Nan::New(Symbols::Result), ArrayWrapper::New(v.first));
            result->Set(Nan::New(Symbols::Pivot), ArrayWrapper::New(v.second));
            return scope.Escape(result);
        };
        Nan::AsyncQueueWorker(new WorkerT(GetCallback(info), move(exec), move(conv)));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Lu)
{

    try
    {
        ARGS_LEN(2);
        auto pArray = ArrayWrapper::GetArrayAt(info, 0);
        typedef tuple<af::array, af::array, af::array> ResultT;
        typedef Worker<ResultT> WorkerT;
        auto exec = [=]()
        {
            Guard guard;
            af::array lower, upper, pivot;
            af::lu(lower, upper, pivot, *pArray);
            return move(make_tuple(lower, upper, pivot));
        };
        auto conv = [=](WorkerT* w, ResultT v)
        {
            Nan::EscapableHandleScope scope;
            auto result = Nan::New<Object>();
            result->Set(Nan::New(Symbols::Lower), ArrayWrapper::New(get<0>(v)));
            result->Set(Nan::New(Symbols::Upper), ArrayWrapper::New(get<1>(v)));
            result->Set(Nan::New(Symbols::Pivot), ArrayWrapper::New(get<2>(v)));
            return scope.Escape(result);
        };
        Nan::AsyncQueueWorker(new WorkerT(GetCallback(info), move(exec), move(conv)));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(LuInPlace)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        bool isLapackPiv = true;
        if (info.Length() > 1) isLapackPiv = info[1]->BooleanValue();
        typedef Worker<af::array> worker_t;
        auto exec = [=]() mutable
        {
            Guard guard;
            af::array pivot;
            af::luInPlace(pivot, array, isLapackPiv);
            return pivot;
        };
        auto conv = [=](worker_t* worker, const af::array& arr)
        {
            return ArrayWrapper::New(arr);
        };
        auto worker = new worker_t(GetCallback(info), std::move(exec), std::move(conv));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(QrPacked)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        typedef pair<af::array, af::array> ResultT;
        typedef Worker<ResultT> WorkerT;
        auto exec = [=]()
        {
            Guard guard;
            af::array out, tau;
            af::qr(out, tau, array);
            return move(make_pair(out, tau));
        };
        auto conv = [=](WorkerT* w, ResultT v)
        {
            Nan::EscapableHandleScope scope;
            auto result = Nan::New<Object>();
            result->Set(Nan::New(Symbols::Result), ArrayWrapper::New(v.first));
            result->Set(Nan::New(Symbols::Tau), ArrayWrapper::New(v.second));
            return scope.Escape(result);
        };
        Nan::AsyncQueueWorker(new WorkerT(GetCallback(info), move(exec), move(conv)));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Qr)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        typedef tuple<af::array, af::array, af::array> ResultT;
        typedef Worker<ResultT> WorkerT;
        auto exec = [=]()
        {
            Guard guard;
            af::array q, r, tau;
            af::qr(q, r, tau, array);
            return move(make_tuple(q, r, tau));
        };
        auto conv = [=](WorkerT* w, ResultT v)
        {
            Nan::EscapableHandleScope scope;
            auto result = Nan::New<Object>();
            result->Set(Nan::New(Symbols::Q), ArrayWrapper::New(get<0>(v)));
            result->Set(Nan::New(Symbols::R), ArrayWrapper::New(get<1>(v)));
            result->Set(Nan::New(Symbols::Tau), ArrayWrapper::New(get<2>(v)));
            return scope.Escape(result);
        };
        Nan::AsyncQueueWorker(new WorkerT(GetCallback(info), move(exec), move(conv)));
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(QrInPlace)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        typedef Worker<af::array> worker_t;
        auto exec = [=]() mutable
        {
            Guard guard;
            af::array tau;
            af::qrInPlace(tau, array);
            return tau;
        };
        auto conv = [=](worker_t* worker, const af::array& arr)
        {
            return ArrayWrapper::New(arr);
        };
        auto worker = new worker_t(GetCallback(info), std::move(exec), std::move(conv));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Det)
{

    try
    {
        ARGS_LEN(2);

        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        if (NeedsDouble(array))
        {
            auto exec = [=]() { Guard guard; return af::det<double>(array); };
            auto worker = new Worker<double>(GetCallback(info), std::move(exec));
            Nan::AsyncQueueWorker(worker);
            info.GetReturnValue().SetUndefined();
        }
        else
        {
            auto exec = [=]() { Guard guard; return af::det<float>(array); };
            auto worker = new Worker<float>(GetCallback(info), std::move(exec));
            Nan::AsyncQueueWorker(worker);
            info.GetReturnValue().SetUndefined();
        }
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Inverse)
{

    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        af::matProp options = AF_MAT_NONE;
        if (info.Length() > 1) options = (af::matProp)info[1]->Uint32Value();
        typedef Worker<af::array> worker_t;
        auto exec = [=]() mutable
        {
            Guard guard;
            return af::inverse(array, options);
        };
        auto conv = [=](worker_t* worker, const af::array& arr)
        {
            return ArrayWrapper::New(arr);
        };
        auto worker = new worker_t(GetCallback(info), std::move(exec), std::move(conv));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Norm)
{

    try
    {
        ARGS_LEN(2);

        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        af::normType type = AF_NORM_EUCLID;
        double p = 1;
        double q = 1;
        if (info.Length() > 1) type = (af::normType)info[1]->Uint32Value();
        if (info.Length() > 2) p = info[2]->NumberValue();
        if (info.Length() > 3) q = info[3]->NumberValue();
        auto exec = [=]() { Guard guard; return af::norm(array, type, p, q); };
        auto worker = new Worker<double>(GetCallback(info), std::move(exec));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Rank)
{

    try
    {
        ARGS_LEN(2);

        auto array = *ArrayWrapper::GetArrayAt(info, 0);
        double tol = 1E-5;
        if (info.Length() > 1) tol = info[1]->NumberValue();
        auto exec = [=]() { Guard guard; return af::rank(array, tol); };
        auto worker = new Worker<double>(GetCallback(info), std::move(exec));
        Nan::AsyncQueueWorker(worker);
        info.GetReturnValue().SetUndefined();
    }
    ARRAYFIRE_CATCH
}

NAN_MODULE_INIT(InitLinearAlgebra)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("dot").ToLocalChecked(), Nan::New<FunctionTemplate>(Dot)->GetFunction());
    Nan::Set(target, Nan::New<String>("matMul").ToLocalChecked(), Nan::New<FunctionTemplate>(MatMul)->GetFunction());
    Nan::Set(target, Nan::New<String>("matMulNT").ToLocalChecked(), Nan::New<FunctionTemplate>(MatMulNT)->GetFunction());
    Nan::Set(target, Nan::New<String>("matMulTN").ToLocalChecked(), Nan::New<FunctionTemplate>(MatMulTN)->GetFunction());
    Nan::Set(target, Nan::New<String>("matMulTT").ToLocalChecked(), Nan::New<FunctionTemplate>(MatMulTT)->GetFunction());
    Nan::Set(target, Nan::New<String>("transpose").ToLocalChecked(), Nan::New<FunctionTemplate>(Transpose)->GetFunction());
    Nan::Set(target, Nan::New<String>("transposeInPlace").ToLocalChecked(), Nan::New<FunctionTemplate>(TransposeInPlace)->GetFunction());
    Nan::Set(target, Nan::New<String>("solve").ToLocalChecked(), Nan::New<FunctionTemplate>(Solve)->GetFunction());
    Nan::Set(target, Nan::New<String>("solveLU").ToLocalChecked(), Nan::New<FunctionTemplate>(SolveLU)->GetFunction());
    Nan::Set(target, Nan::New<String>("cholesky").ToLocalChecked(), Nan::New<FunctionTemplate>(Cholesky)->GetFunction());
    Nan::Set(target, Nan::New<String>("choleskyInPlace").ToLocalChecked(), Nan::New<FunctionTemplate>(CholeskyInPlace)->GetFunction());
    Nan::Set(target, Nan::New<String>("luPacked").ToLocalChecked(), Nan::New<FunctionTemplate>(LuPacked)->GetFunction());
    Nan::Set(target, Nan::New<String>("lu").ToLocalChecked(), Nan::New<FunctionTemplate>(Lu)->GetFunction());
    Nan::Set(target, Nan::New<String>("luInPlace").ToLocalChecked(), Nan::New<FunctionTemplate>(LuInPlace)->GetFunction());
    Nan::Set(target, Nan::New<String>("qrPacked").ToLocalChecked(), Nan::New<FunctionTemplate>(QrPacked)->GetFunction());
    Nan::Set(target, Nan::New<String>("qr").ToLocalChecked(), Nan::New<FunctionTemplate>(Qr)->GetFunction());
    Nan::Set(target, Nan::New<String>("qrInPlace").ToLocalChecked(), Nan::New<FunctionTemplate>(QrInPlace)->GetFunction());
    Nan::Set(target, Nan::New<String>("det").ToLocalChecked(), Nan::New<FunctionTemplate>(Det)->GetFunction());
    Nan::Set(target, Nan::New<String>("inverse").ToLocalChecked(), Nan::New<FunctionTemplate>(Inverse)->GetFunction());
    Nan::Set(target, Nan::New<String>("norm").ToLocalChecked(), Nan::New<FunctionTemplate>(Norm)->GetFunction());
    Nan::Set(target, Nan::New<String>("rank").ToLocalChecked(), Nan::New<FunctionTemplate>(Rank)->GetFunction());
}
