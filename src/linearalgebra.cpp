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
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        af::matProp optLhs = AF_MAT_NONE;
        af::matProp optRhs = AF_MAT_NONE;
        if (args.Length() > 2) optLhs = (af::matProp)args[2]->Uint32Value();
        if (args.Length() > 3) optRhs = (af::matProp)args[3]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::dot(*pArray1, *pArray2, optLhs, optRhs));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(MatMul)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        auto pArray3 = (args.Length() > 2) ? ArrayWrapper::TryGetArrayAt(args, 2) : nullptr;
        if (pArray3 == nullptr)
        {
            af::matProp optLhs = AF_MAT_NONE;
            af::matProp optRhs = AF_MAT_NONE;
            if (args.Length() > 2) optLhs = (af::matProp)args[2]->Uint32Value();
            if (args.Length() > 3) optRhs = (af::matProp)args[3]->Uint32Value();
            Guard();
            ArrayWrapper::New(af::matmul(*pArray1, *pArray2, optLhs, optRhs));
        }
        else
        {
            auto pArray4 = (args.Length() > 3) ? ArrayWrapper::TryGetArrayAt(args, 3) : nullptr;
            if (pArray4 == nullptr)
            {
                Guard();
                ArrayWrapper::New(af::matmul(*pArray1, *pArray2, *pArray3));
            }
            else
            {
                Guard();
                ArrayWrapper::New(af::matmul(*pArray1, *pArray2, *pArray3, *pArray4));
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
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        af::matProp options = AF_MAT_NONE;
        if (args.Length() > 2) options = (af::matProp)args[2]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::solve(*pArray1, *pArray2, options));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(SolveLU)
{
    NanScope();
    try
    {
        ARGS_LEN(3);
        auto pArray1 = ArrayWrapper::GetArrayAt(args, 0);
        auto pArray2 = ArrayWrapper::GetArrayAt(args, 1);
        auto pArray3 = ArrayWrapper::GetArrayAt(args, 2);
        af::matProp options = AF_MAT_NONE;
        if (args.Length() > 3) options = (af::matProp)args[3]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::solveLU(*pArray1, *pArray2, *pArray3, options));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Cholesky)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        bool isUpper = true;
        if (args.Length() > 1) isUpper = args[1]->BooleanValue();
        typedef pair<af::array, int> ResultT;
        typedef Worker<ResultT> WorkerT;
        auto exec = [=]()
        {
            Guard();
            af::array out;
            int r = af::cholesky(out, array, isUpper);
            return move(make_pair(out, r));
        };
        auto conv = [=](WorkerT* w, ResultT v)
        {
            auto result = NanNew<Object>();
            result->Set(NanNew(Symbols::Result), ArrayWrapper::New(v.first));
            result->Set(NanNew(Symbols::FailedAtRank), NanNew(v.second));
            return result;
        };
        NanAsyncQueueWorker(new WorkerT(GetCallback(args), move(exec), move(conv)));
        NanReturnUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(CholeskyInPlace)
{
    NanScope();
    try
    {
        ARGS_LEN(2);
        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        bool isUpper = true;
        if (args.Length() > 1) isUpper = args[1]->BooleanValue();
        NanAsyncQueueWorker(new Worker<int>(GetCallback(args), [=]() mutable { Guard(); return af::choleskyInPlace(array, isUpper); }));
        NanReturnUndefined();
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(LuPacked)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        bool isLapackPiv = true;
        if (args.Length() > 1) isLapackPiv = args[1]->BooleanValue();
        Guard();
        af::array out, pivot;
        af::lu(out, pivot, (const af::array&)*pArray, isLapackPiv);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Result), ArrayWrapper::New(out));
        result->Set(NanNew(Symbols::Pivot), ArrayWrapper::New(pivot));
        NanReturnValue(result);
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Lu)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        Guard();
        af::array lower, upper, pivot;
        af::lu(lower, upper, pivot, *pArray);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Lower), ArrayWrapper::New(lower));
        result->Set(NanNew(Symbols::Upper), ArrayWrapper::New(upper));
        result->Set(NanNew(Symbols::Pivot), ArrayWrapper::New(pivot));
        NanReturnValue(result);
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(LuInPlace)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        bool isLapackPiv = true;
        if (args.Length() > 1) isLapackPiv = args[1]->BooleanValue();
        Guard();
        af::array pivot;
        af::luInPlace(pivot, *pArray, isLapackPiv);
        NanReturnValue(ArrayWrapper::New(pivot));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(QrPacked)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        Guard();
        af::array out, tau;
        af::qr(out, tau, *pArray);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Result), ArrayWrapper::New(out));
        result->Set(NanNew(Symbols::Tau), ArrayWrapper::New(tau));
        NanReturnValue(result);
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Qr)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        Guard();
        af::array q, r, tau;
        af::qr(q, r, tau, *pArray);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Q), ArrayWrapper::New(q));
        result->Set(NanNew(Symbols::R), ArrayWrapper::New(r));
        result->Set(NanNew(Symbols::Tau), ArrayWrapper::New(tau));
        NanReturnValue(result);
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(QrInPlace)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        Guard();
        af::array tau;
        af::qrInPlace(tau, *pArray);
        NanReturnValue(ArrayWrapper::New(tau));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Det)
{
    NanScope();
    try
    {
        ARGS_LEN(2);

        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        if (NeedsDouble(array))
        {
            auto exec = [=]() { Guard(); return af::det<double>(array); };
            auto worker = new Worker<double>(GetCallback(args), std::move(exec));
            NanAsyncQueueWorker(worker);
            NanReturnUndefined();
        }
        else
        {
            auto exec = [=]() { Guard(); return af::det<float>(array); };
            auto worker = new Worker<float>(GetCallback(args), std::move(exec));
            NanAsyncQueueWorker(worker);
            NanReturnUndefined();
        }
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Inverse)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        af::matProp options = AF_MAT_NONE;
        if (args.Length() > 1) options = (af::matProp)args[1]->Uint32Value();
        Guard();
        ArrayWrapper::New(af::inverse(*pArray, options));
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(Norm)
{
    NanScope();
    try
    {
        ARGS_LEN(2);

        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        af::normType type = AF_NORM_EUCLID;
        double p = 1;
        double q = 1;
        if (args.Length() > 1) type = (af::normType)args[1]->Uint32Value();
        if (args.Length() > 2) p = args[2]->NumberValue();
        if (args.Length() > 3) q = args[3]->NumberValue();
        auto exec = [=]() { Guard(); return af::norm(array, type, p, q); };
        auto worker = new Worker<double>(GetCallback(args), std::move(exec));
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    ARRAYFIRE_CATCH
}

NAN_METHOD(Rank)
{
    NanScope();
    try
    {
        ARGS_LEN(2);

        auto array = *ArrayWrapper::GetArrayAt(args, 0);
        double tol = 1E-5;
        if (args.Length() > 1) tol = args[1]->NumberValue();
        auto exec = [=]() { Guard(); return af::rank(array, tol); };
        auto worker = new Worker<double>(GetCallback(args), std::move(exec));
        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    ARRAYFIRE_CATCH
}

void InitLinearAlgebra(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew("dot"), NanNew<FunctionTemplate>(Dot)->GetFunction());
    exports->Set(NanNew("matMul"), NanNew<FunctionTemplate>(MatMul)->GetFunction());
    exports->Set(NanNew("matMulNT"), NanNew<FunctionTemplate>(MatMulNT)->GetFunction());
    exports->Set(NanNew("matMulTN"), NanNew<FunctionTemplate>(MatMulTN)->GetFunction());
    exports->Set(NanNew("matMulTT"), NanNew<FunctionTemplate>(MatMulTT)->GetFunction());
    exports->Set(NanNew("transpose"), NanNew<FunctionTemplate>(Transpose)->GetFunction());
    exports->Set(NanNew("transposeInPlace"), NanNew<FunctionTemplate>(TransposeInPlace)->GetFunction());
    exports->Set(NanNew("solve"), NanNew<FunctionTemplate>(Solve)->GetFunction());
    exports->Set(NanNew("solveLU"), NanNew<FunctionTemplate>(SolveLU)->GetFunction());
    exports->Set(NanNew("cholesky"), NanNew<FunctionTemplate>(Cholesky)->GetFunction());
    exports->Set(NanNew("choleskyInPlace"), NanNew<FunctionTemplate>(CholeskyInPlace)->GetFunction());
    exports->Set(NanNew("luPacked"), NanNew<FunctionTemplate>(LuPacked)->GetFunction());
    exports->Set(NanNew("lu"), NanNew<FunctionTemplate>(Lu)->GetFunction());
    exports->Set(NanNew("luInPlace"), NanNew<FunctionTemplate>(LuInPlace)->GetFunction());
    exports->Set(NanNew("qrPacked"), NanNew<FunctionTemplate>(QrPacked)->GetFunction());
    exports->Set(NanNew("qr"), NanNew<FunctionTemplate>(Qr)->GetFunction());
    exports->Set(NanNew("qrInPlace"), NanNew<FunctionTemplate>(QrInPlace)->GetFunction());
    exports->Set(NanNew("det"), NanNew<FunctionTemplate>(Det)->GetFunction());
    exports->Set(NanNew("inverse"), NanNew<FunctionTemplate>(Inverse)->GetFunction());
    exports->Set(NanNew("norm"), NanNew<FunctionTemplate>(Norm)->GetFunction());
    exports->Set(NanNew("rank"), NanNew<FunctionTemplate>(Rank)->GetFunction());
}
