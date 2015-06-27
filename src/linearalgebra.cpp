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
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        bool isUpper = true;
        if (args.Length() > 1) isUpper = args[1]->BooleanValue();
        Guard();
        af::array out;
        int r = af::cholesky(out, *pArray, isUpper);
        auto result = NanNew<Object>();
        result->Set(NanNew(Symbols::Result), NanNew(r));
        result->Set(NanNew(Symbols::Succeeded), NanNew((bool)r));
        NanReturnValue(result);
    }
    ARRAYFIRE_CATCH;
}

NAN_METHOD(CholeskyInPlace)
{
    NanScope();
    try
    {
        ARGS_LEN(1);
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        bool isUpper = true;
        if (args.Length() > 1) isUpper = args[1]->BooleanValue();
        Guard();
        af::array out;
        int r = af::choleskyInPlace(*pArray, isUpper);
        NanReturnValue((bool)r);
    }
    ARRAYFIRE_CATCH;
}

//AFAPI void 	lu (array &out, array &pivot, const array &in, const bool is_lapack_piv=true)
//AFAPI void 	lu (array &lower, array &upper, array &pivot, const array &in)

//AFAPI void 	qr (array &out, array &tau, const array &in)
//AFAPI void 	qr (array &q, array &r, array &tau, const array &in)
//AFAPI void 	qrInPlace (array &tau, array &in)

//template<typename T >
//T 	det (const array &in)

//AFAPI array 	inverse (const array &in, const matProp options=AF_MAT_NONE)

//AFAPI double 	norm (const array &in, const normType type=AF_NORM_EUCLID, const double p=1, const double q=1)

//AFAPI unsigned 	rank (const array &in, const double tol=1E-5)

void InitLinearAlgebra(v8::Handle<v8::Object> exports)
{
}
