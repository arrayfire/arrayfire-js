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
#include "mathfunctions.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

FIRE_ASYNC_METHOD_ARR(Abs, abs)
FIRE_ASYNC_METHOD_ARR(Arg, arg)
FIRE_ASYNC_METHOD_ARR(Ceil, ceil)
FIRE_ASYNC_METHOD_ARR(Floor, floor)
FIRE_ASYNC_METHOD_ARR_ARR(Hypot, hypot)
FIRE_ASYNC_METHOD_ARR_ARR(Max, max)
FIRE_ASYNC_METHOD_ARR_ARR(Min, min)
FIRE_ASYNC_METHOD_ARR_ARR(Mod, mod)
FIRE_ASYNC_METHOD_ARR(Round, round)
FIRE_ASYNC_METHOD_ARR(Sign, sign)
FIRE_ASYNC_METHOD_ARR(Trunc, trunc)
FIRE_ASYNC_METHOD_ARR_DOUBLE_COMB(Rem, rem)

FIRE_ASYNC_METHOD_ARR(ACos, acos)
FIRE_ASYNC_METHOD_ARR(ASin, asin)
FIRE_ASYNC_METHOD_ARR(ATan, atan)
FIRE_ASYNC_METHOD_ARR_DOUBLE_COMB(ATan2, atan2)
FIRE_ASYNC_METHOD_ARR(Cos, cos)
FIRE_ASYNC_METHOD_ARR(Sin, sin)
FIRE_ASYNC_METHOD_ARR(Tan, tan)

FIRE_ASYNC_METHOD_ARR(Cbrt, cbrt)
FIRE_ASYNC_METHOD_ARR(Erf, erf)
FIRE_ASYNC_METHOD_ARR(Erfc, erfc)
FIRE_ASYNC_METHOD_ARR(Exp, exp)
FIRE_ASYNC_METHOD_ARR(ExpM1, expm1)
FIRE_ASYNC_METHOD_ARR(Factorial, factorial)
FIRE_ASYNC_METHOD_ARR(LGamma, lgamma)
FIRE_ASYNC_METHOD_ARR(TGamma, tgamma)
FIRE_ASYNC_METHOD_ARR(Log, log)
FIRE_ASYNC_METHOD_ARR(Log10, log10)
FIRE_ASYNC_METHOD_ARR(Log1P, log1p)
FIRE_ASYNC_METHOD_ARR_DOUBLE_COMB(Pow, pow)
FIRE_ASYNC_METHOD_ARR(Pow2, pow2)
FIRE_ASYNC_METHOD_ARR_DOUBLE_COMB(Root, root)
FIRE_ASYNC_METHOD_ARR(Sqrt, sqrt)

FIRE_ASYNC_METHOD_ARR(ACosH, acosh)
FIRE_ASYNC_METHOD_ARR(ASinH, asinh)
FIRE_ASYNC_METHOD_ARR(ATanH, atanh)
FIRE_ASYNC_METHOD_ARR(CosH, cosh)
FIRE_ASYNC_METHOD_ARR(SinH, sinh)
FIRE_ASYNC_METHOD_ARR(TanH, tanh)

FIRE_ASYNC_METHOD_ARR(Complex, complex)
FIRE_ASYNC_METHOD_ARR(Conjg, conjg)
FIRE_ASYNC_METHOD_ARR(Imag, imag)
FIRE_ASYNC_METHOD_ARR(Real, real)

void InitMathFunctions(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew<String>("abs"), NanNew<FunctionTemplate>(Abs)->GetFunction());
    exports->Set(NanNew<String>("arg"), NanNew<FunctionTemplate>(Arg)->GetFunction());
    exports->Set(NanNew<String>("ceil"), NanNew<FunctionTemplate>(Ceil)->GetFunction());
    exports->Set(NanNew<String>("floor"), NanNew<FunctionTemplate>(Floor)->GetFunction());
    exports->Set(NanNew<String>("hypot"), NanNew<FunctionTemplate>(Hypot)->GetFunction());
    exports->Set(NanNew<String>("max"), NanNew<FunctionTemplate>(Max)->GetFunction());
    exports->Set(NanNew<String>("min"), NanNew<FunctionTemplate>(Min)->GetFunction());
    exports->Set(NanNew<String>("round"), NanNew<FunctionTemplate>(Round)->GetFunction());
    exports->Set(NanNew<String>("sign"), NanNew<FunctionTemplate>(Sign)->GetFunction());
    exports->Set(NanNew<String>("trunc"), NanNew<FunctionTemplate>(Trunc)->GetFunction());
    exports->Set(NanNew<String>("rem"), NanNew<FunctionTemplate>(Rem)->GetFunction());

    exports->Set(NanNew<String>("acos"), NanNew<FunctionTemplate>(ACos)->GetFunction());
    exports->Set(NanNew<String>("aCos"), NanNew<FunctionTemplate>(ACos)->GetFunction());
    exports->Set(NanNew<String>("asin"), NanNew<FunctionTemplate>(ASin)->GetFunction());
    exports->Set(NanNew<String>("aSin"), NanNew<FunctionTemplate>(ASin)->GetFunction());
    exports->Set(NanNew<String>("atan"), NanNew<FunctionTemplate>(ATan)->GetFunction());
    exports->Set(NanNew<String>("aTan"), NanNew<FunctionTemplate>(ATan)->GetFunction());
    exports->Set(NanNew<String>("atan2"), NanNew<FunctionTemplate>(ATan2)->GetFunction());
    exports->Set(NanNew<String>("aTan2"), NanNew<FunctionTemplate>(ATan2)->GetFunction());
    exports->Set(NanNew<String>("cos"), NanNew<FunctionTemplate>(Cos)->GetFunction());
    exports->Set(NanNew<String>("sin"), NanNew<FunctionTemplate>(Sin)->GetFunction());
    exports->Set(NanNew<String>("tan"), NanNew<FunctionTemplate>(Tan)->GetFunction());

    exports->Set(NanNew<String>("cbrt"), NanNew<FunctionTemplate>(Cbrt)->GetFunction());
    exports->Set(NanNew<String>("erf"), NanNew<FunctionTemplate>(Erf)->GetFunction());
    exports->Set(NanNew<String>("erfc"), NanNew<FunctionTemplate>(Erfc)->GetFunction());
    exports->Set(NanNew<String>("exp"), NanNew<FunctionTemplate>(Exp)->GetFunction());
    exports->Set(NanNew<String>("expm1"), NanNew<FunctionTemplate>(ExpM1)->GetFunction());
    exports->Set(NanNew<String>("expM1"), NanNew<FunctionTemplate>(ExpM1)->GetFunction());
    exports->Set(NanNew<String>("factorial"), NanNew<FunctionTemplate>(Factorial)->GetFunction());
    exports->Set(NanNew<String>("lgamma"), NanNew<FunctionTemplate>(LGamma)->GetFunction());
    exports->Set(NanNew<String>("lGamma"), NanNew<FunctionTemplate>(LGamma)->GetFunction());
    exports->Set(NanNew<String>("tgamma"), NanNew<FunctionTemplate>(TGamma)->GetFunction());
    exports->Set(NanNew<String>("tGamma"), NanNew<FunctionTemplate>(TGamma)->GetFunction());
    exports->Set(NanNew<String>("log"), NanNew<FunctionTemplate>(Log)->GetFunction());
    exports->Set(NanNew<String>("log10"), NanNew<FunctionTemplate>(Log10)->GetFunction());
    exports->Set(NanNew<String>("log1p"), NanNew<FunctionTemplate>(Log1P)->GetFunction());
    exports->Set(NanNew<String>("log1P"), NanNew<FunctionTemplate>(Log1P)->GetFunction());
    exports->Set(NanNew<String>("pow"), NanNew<FunctionTemplate>(Pow)->GetFunction());
    exports->Set(NanNew<String>("pow2"), NanNew<FunctionTemplate>(Pow2)->GetFunction());
    exports->Set(NanNew<String>("root"), NanNew<FunctionTemplate>(Root)->GetFunction());
    exports->Set(NanNew<String>("sqrt"), NanNew<FunctionTemplate>(Sqrt)->GetFunction());

    exports->Set(NanNew<String>("acosh"), NanNew<FunctionTemplate>(ACosH)->GetFunction());
    exports->Set(NanNew<String>("aCosH"), NanNew<FunctionTemplate>(ACosH)->GetFunction());
    exports->Set(NanNew<String>("asinh"), NanNew<FunctionTemplate>(ASinH)->GetFunction());
    exports->Set(NanNew<String>("aSinH"), NanNew<FunctionTemplate>(ASinH)->GetFunction());
    exports->Set(NanNew<String>("atanh"), NanNew<FunctionTemplate>(ATanH)->GetFunction());
    exports->Set(NanNew<String>("aTanH"), NanNew<FunctionTemplate>(ATanH)->GetFunction());

    exports->Set(NanNew<String>("complex"), NanNew<FunctionTemplate>(Complex)->GetFunction());
    exports->Set(NanNew<String>("conjg"), NanNew<FunctionTemplate>(Conjg)->GetFunction());
    exports->Set(NanNew<String>("imag"), NanNew<FunctionTemplate>(Imag)->GetFunction());
    exports->Set(NanNew<String>("real"), NanNew<FunctionTemplate>(Real)->GetFunction());
}
