#include "ext.h"
#include "moveandreorderarray.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

NAN_METHOD(Join)
{
    NanScope();

    try
    {
        ARGS_LEN(3);

        af::dtype dim = GetDTypeInfo(args[0]).first;
        af::array array1 = *ArrayWrapper::GetArrayAt(args, 1);
        af::array array2 = *ArrayWrapper::GetArrayAt(args, 2);

        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::join(dim, array1, array2))); });
    }
    FIRE_CATCH
}

#define M_R_XYZW_F(F, f, iy, iz, iw)\
NAN_METHOD(F)\
{\
    NanScope();\
    \
    try\
    {\
        ARGS_LEN(2);\
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

M_R_XYZW_F(Tile, tile, 1, 1, 1)

M_R_XYZW_F(Reorder, reorder, 1, 2, 3)

M_R_XYZW_F(Shift, shift, 0, 0, 0)

M_R_XYZW_F(ModDims, moddims, 1, 1, 1)

NAN_METHOD(Flat)
{
    NanScope();

    try
    {
        ARGS_LEN(1);

        af::array array = *ArrayWrapper::GetArrayAt(args, 0);

        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::flat(array))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Flip)
{
    NanScope();

    try
    {
        ARGS_LEN(2);

        af::array array = *ArrayWrapper::GetArrayAt(args, 0);
        af::dtype dim = GetDTypeInfo(args[1]).first;

        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::flip(array, dim))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Transpose)
{
    NanScope();

    try
    {
        ARGS_LEN(1);

        af::array array = *ArrayWrapper::GetArrayAt(args, 0);
        bool conjugate = args.Length() != 1 ? args[1]->BooleanValue() : false;

        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::transpose(array, conjugate))); });
    }
    FIRE_CATCH
}

void InitMoveAndReorderArray(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew<String>("join"), NanNew<FunctionTemplate>(Join)->GetFunction());
    exports->Set(NanNew<String>("tile"), NanNew<FunctionTemplate>(Tile)->GetFunction());
    exports->Set(NanNew<String>("reorder"), NanNew<FunctionTemplate>(Reorder)->GetFunction());
    exports->Set(NanNew<String>("shift"), NanNew<FunctionTemplate>(Shift)->GetFunction());
    exports->Set(NanNew<String>("moddims"), NanNew<FunctionTemplate>(ModDims)->GetFunction());
    exports->Set(NanNew<String>("modDims"), NanNew<FunctionTemplate>(ModDims)->GetFunction());
    exports->Set(NanNew<String>("flat"), NanNew<FunctionTemplate>(Flat)->GetFunction());
    exports->Set(NanNew<String>("flip"), NanNew<FunctionTemplate>(Flip)->GetFunction());
    exports->Set(NanNew<String>("transpose"), NanNew<FunctionTemplate>(Transpose)->GetFunction());
}
