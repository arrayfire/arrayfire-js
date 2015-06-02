#include "ext.h"
#include "arrayhelperfunctions.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

#define AHF_IS_SOMETHING(F, f)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(1);\
        \
        af::array array = *ArrayWrapper::GetArrayAt(args, 0);\
        \
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::f(array))); });\
    }\
    FIRE_CATCH\
}

AHF_IS_SOMETHING(IsZero, iszero)
AHF_IS_SOMETHING(IsInf, isInf)
AHF_IS_SOMETHING(IsNaN, isNaN)

void InitArrayHelperFunctions(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew<String>("iszero"), NanNew<FunctionTemplate>(IsZero)->GetFunction());
    exports->Set(NanNew<String>("isZero"), NanNew<FunctionTemplate>(IsZero)->GetFunction());
    exports->Set(NanNew<String>("isInf"), NanNew<FunctionTemplate>(IsInf)->GetFunction());
    exports->Set(NanNew<String>("isNaN"), NanNew<FunctionTemplate>(IsNaN)->GetFunction());
}
