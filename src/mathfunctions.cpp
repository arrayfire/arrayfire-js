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
#include "mathfunctions.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

namespace af
{
    // TODO: Remove this when next version comes out:
    af::array sigmoid(const af::array val)
    {
        return 1 / (1 + exp(-val));
    }
}

using namespace v8;
using namespace std;
using namespace node;

ARRAYFIRE_SYNC_METHOD_ARR(Abs, abs)
ARRAYFIRE_SYNC_METHOD_ARR(Arg, arg)
ARRAYFIRE_SYNC_METHOD_ARR(Ceil, ceil)
ARRAYFIRE_SYNC_METHOD_ARR(Floor, floor)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(Hypot, hypot)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(Max, max)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(Min, min)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(Mod, mod)
ARRAYFIRE_SYNC_METHOD_ARR(Round, round)
ARRAYFIRE_SYNC_METHOD_ARR(Sign, sign)
ARRAYFIRE_SYNC_METHOD_ARR(Trunc, trunc)
ARRAYFIRE_SYNC_METHOD_ARR_DOUBLE_COMB(Rem, rem)

ARRAYFIRE_SYNC_METHOD_ARR(ACos, acos)
ARRAYFIRE_SYNC_METHOD_ARR(ASin, asin)
ARRAYFIRE_SYNC_METHOD_ARR(ATan, atan)
ARRAYFIRE_SYNC_METHOD_ARR_DOUBLE_COMB(ATan2, atan2)
ARRAYFIRE_SYNC_METHOD_ARR(Cos, cos)
ARRAYFIRE_SYNC_METHOD_ARR(Sin, sin)
ARRAYFIRE_SYNC_METHOD_ARR(Tan, tan)

ARRAYFIRE_SYNC_METHOD_ARR(Cbrt, cbrt)
ARRAYFIRE_SYNC_METHOD_ARR(Erf, erf)
ARRAYFIRE_SYNC_METHOD_ARR(Erfc, erfc)
ARRAYFIRE_SYNC_METHOD_ARR(Exp, exp)
ARRAYFIRE_SYNC_METHOD_ARR(ExpM1, expm1)
ARRAYFIRE_SYNC_METHOD_ARR(Factorial, factorial)
ARRAYFIRE_SYNC_METHOD_ARR(LGamma, lgamma)
ARRAYFIRE_SYNC_METHOD_ARR(TGamma, tgamma)
ARRAYFIRE_SYNC_METHOD_ARR(Log, log)
ARRAYFIRE_SYNC_METHOD_ARR(Log10, log10)
ARRAYFIRE_SYNC_METHOD_ARR(Log1P, log1p)
ARRAYFIRE_SYNC_METHOD_ARR_ARR(Pow, pow)
ARRAYFIRE_SYNC_METHOD_ARR(Pow2, pow2)
ARRAYFIRE_SYNC_METHOD_ARR_DOUBLE_COMB(Root, root)
ARRAYFIRE_SYNC_METHOD_ARR(Sqrt, sqrt)
ARRAYFIRE_SYNC_METHOD_ARR(Sigmoid, sigmoid)

ARRAYFIRE_SYNC_METHOD_ARR(ACosH, acosh)
ARRAYFIRE_SYNC_METHOD_ARR(ASinH, asinh)
ARRAYFIRE_SYNC_METHOD_ARR(ATanH, atanh)
ARRAYFIRE_SYNC_METHOD_ARR(CosH, cosh)
ARRAYFIRE_SYNC_METHOD_ARR(SinH, sinh)
ARRAYFIRE_SYNC_METHOD_ARR(TanH, tanh)

ARRAYFIRE_SYNC_METHOD_ARR(Complex, complex)
ARRAYFIRE_SYNC_METHOD_ARR(Conjg, conjg)
ARRAYFIRE_SYNC_METHOD_ARR(Imag, imag)
ARRAYFIRE_SYNC_METHOD_ARR(Real, real)

NAN_MODULE_INIT(InitMathFunctions)
{
    Nan::HandleScope scope;

    Nan::Set(target, Nan::New<String>("abs").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Abs)->GetFunction());

    Nan::Set(target, Nan::New<String>("arg").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Arg)->GetFunction());

    Nan::Set(target, Nan::New<String>("ceil").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Ceil)->GetFunction());

    Nan::Set(target, Nan::New<String>("floor").ToLocalChecked(),
        Nan::New<FunctionTemplate>(Floor)->GetFunction());

    Nan::Set(target, Nan::New<String>("hypot").ToLocalChecked(), Nan::New<FunctionTemplate>(Hypot)->GetFunction());
    Nan::Set(target, Nan::New<String>("max").ToLocalChecked(), Nan::New<FunctionTemplate>(Max)->GetFunction());
    Nan::Set(target, Nan::New<String>("min").ToLocalChecked(), Nan::New<FunctionTemplate>(Min)->GetFunction());
    Nan::Set(target, Nan::New<String>("round").ToLocalChecked(), Nan::New<FunctionTemplate>(Round)->GetFunction());
    Nan::Set(target, Nan::New<String>("sign").ToLocalChecked(), Nan::New<FunctionTemplate>(Sign)->GetFunction());
    Nan::Set(target, Nan::New<String>("trunc").ToLocalChecked(), Nan::New<FunctionTemplate>(Trunc)->GetFunction());
    Nan::Set(target, Nan::New<String>("rem").ToLocalChecked(), Nan::New<FunctionTemplate>(Rem)->GetFunction());

    Nan::Set(target, Nan::New<String>("acos").ToLocalChecked(), Nan::New<FunctionTemplate>(ACos)->GetFunction());
    Nan::Set(target, Nan::New<String>("aCos").ToLocalChecked(), Nan::New<FunctionTemplate>(ACos)->GetFunction());
    Nan::Set(target, Nan::New<String>("asin").ToLocalChecked(), Nan::New<FunctionTemplate>(ASin)->GetFunction());
    Nan::Set(target, Nan::New<String>("aSin").ToLocalChecked(), Nan::New<FunctionTemplate>(ASin)->GetFunction());
    Nan::Set(target, Nan::New<String>("atan").ToLocalChecked(), Nan::New<FunctionTemplate>(ATan)->GetFunction());
    Nan::Set(target, Nan::New<String>("aTan").ToLocalChecked(), Nan::New<FunctionTemplate>(ATan)->GetFunction());
    Nan::Set(target, Nan::New<String>("atan2").ToLocalChecked(), Nan::New<FunctionTemplate>(ATan2)->GetFunction());
    Nan::Set(target, Nan::New<String>("aTan2").ToLocalChecked(), Nan::New<FunctionTemplate>(ATan2)->GetFunction());
    Nan::Set(target, Nan::New<String>("cos").ToLocalChecked(), Nan::New<FunctionTemplate>(Cos)->GetFunction());
    Nan::Set(target, Nan::New<String>("sin").ToLocalChecked(), Nan::New<FunctionTemplate>(Sin)->GetFunction());
    Nan::Set(target, Nan::New<String>("tan").ToLocalChecked(), Nan::New<FunctionTemplate>(Tan)->GetFunction());

    Nan::Set(target, Nan::New<String>("cbrt").ToLocalChecked(), Nan::New<FunctionTemplate>(Cbrt)->GetFunction());
    Nan::Set(target, Nan::New<String>("erf").ToLocalChecked(), Nan::New<FunctionTemplate>(Erf)->GetFunction());
    Nan::Set(target, Nan::New<String>("erfc").ToLocalChecked(), Nan::New<FunctionTemplate>(Erfc)->GetFunction());
    Nan::Set(target, Nan::New<String>("exp").ToLocalChecked(), Nan::New<FunctionTemplate>(Exp)->GetFunction());
    Nan::Set(target, Nan::New<String>("expm1").ToLocalChecked(), Nan::New<FunctionTemplate>(ExpM1)->GetFunction());
    Nan::Set(target, Nan::New<String>("expM1").ToLocalChecked(), Nan::New<FunctionTemplate>(ExpM1)->GetFunction());
    Nan::Set(target, Nan::New<String>("factorial").ToLocalChecked(), Nan::New<FunctionTemplate>(Factorial)->GetFunction());
    Nan::Set(target, Nan::New<String>("lgamma").ToLocalChecked(), Nan::New<FunctionTemplate>(LGamma)->GetFunction());
    Nan::Set(target, Nan::New<String>("lGamma").ToLocalChecked(), Nan::New<FunctionTemplate>(LGamma)->GetFunction());
    Nan::Set(target, Nan::New<String>("tgamma").ToLocalChecked(), Nan::New<FunctionTemplate>(TGamma)->GetFunction());
    Nan::Set(target, Nan::New<String>("tGamma").ToLocalChecked(), Nan::New<FunctionTemplate>(TGamma)->GetFunction());
    Nan::Set(target, Nan::New<String>("log").ToLocalChecked(), Nan::New<FunctionTemplate>(Log)->GetFunction());
    Nan::Set(target, Nan::New<String>("log10").ToLocalChecked(), Nan::New<FunctionTemplate>(Log10)->GetFunction());
    Nan::Set(target, Nan::New<String>("log1p").ToLocalChecked(), Nan::New<FunctionTemplate>(Log1P)->GetFunction());
    Nan::Set(target, Nan::New<String>("log1P").ToLocalChecked(), Nan::New<FunctionTemplate>(Log1P)->GetFunction());
    Nan::Set(target, Nan::New<String>("pow").ToLocalChecked(), Nan::New<FunctionTemplate>(Pow)->GetFunction());
    Nan::Set(target, Nan::New<String>("pow2").ToLocalChecked(), Nan::New<FunctionTemplate>(Pow2)->GetFunction());
    Nan::Set(target, Nan::New<String>("root").ToLocalChecked(), Nan::New<FunctionTemplate>(Root)->GetFunction());
    Nan::Set(target, Nan::New<String>("sqrt").ToLocalChecked(), Nan::New<FunctionTemplate>(Sqrt)->GetFunction());

    Nan::Set(target, Nan::New<String>("acosh").ToLocalChecked(), Nan::New<FunctionTemplate>(ACosH)->GetFunction());
    Nan::Set(target, Nan::New<String>("aCosH").ToLocalChecked(), Nan::New<FunctionTemplate>(ACosH)->GetFunction());
    Nan::Set(target, Nan::New<String>("asinh").ToLocalChecked(), Nan::New<FunctionTemplate>(ASinH)->GetFunction());
    Nan::Set(target, Nan::New<String>("aSinH").ToLocalChecked(), Nan::New<FunctionTemplate>(ASinH)->GetFunction());
    Nan::Set(target, Nan::New<String>("atanh").ToLocalChecked(), Nan::New<FunctionTemplate>(ATanH)->GetFunction());
    Nan::Set(target, Nan::New<String>("aTanH").ToLocalChecked(), Nan::New<FunctionTemplate>(ATanH)->GetFunction());

    Nan::Set(target, Nan::New<String>("complex").ToLocalChecked(), Nan::New<FunctionTemplate>(Complex)->GetFunction());
    Nan::Set(target, Nan::New<String>("conjg").ToLocalChecked(), Nan::New<FunctionTemplate>(Conjg)->GetFunction());
    Nan::Set(target, Nan::New<String>("imag").ToLocalChecked(), Nan::New<FunctionTemplate>(Imag)->GetFunction());
    Nan::Set(target, Nan::New<String>("real").ToLocalChecked(), Nan::New<FunctionTemplate>(Real)->GetFunction());

    Nan::Set(target, Nan::New<String>("sigmoid").ToLocalChecked(), Nan::New<FunctionTemplate>(Sigmoid)->GetFunction());
}
