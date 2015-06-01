#include "ext.h"
#include "createarray.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"

using namespace v8;
using namespace std;
using namespace node;

NAN_METHOD(RandU)
{
    NanScope();

    try
    {
        auto dimAndType = ParseDimAndTypeArgs(args);
        return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::randu(dimAndType.first, dimAndType.second))); });
    }
    FIRE_CATCH
}

NAN_METHOD(RandN)
{
    NanScope();

    try
    {
        auto dimAndType = ParseDimAndTypeArgs(args);
        return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::randn(dimAndType.first, dimAndType.second))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Identity)
{
    NanScope();

    try
    {
        auto dimAndType = ParseDimAndTypeArgs(args);
        return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::identity(dimAndType.first, dimAndType.second))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Range)
{
    NanScope();

    try
    {
        if (args.Length() < 4)
        {
            return NanThrowInvalidNumberOfArgumentsError();
        }
        auto dimAndType = ParseDimAndTypeArgs(args, -1, 1);
        dim_type seqDim = args[args.Length() - 3]->Uint32Value();
        return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::range(dimAndType.first, seqDim, dimAndType.second))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Iota)
{
    NanScope();

    try
    {
        if (args.Length() < 4)
        {
            return NanThrowInvalidNumberOfArgumentsError();
        }
        auto dims = ToDim4(args[0]);
        auto titleDims = ToDim4(args[1]);
        auto type = ConvDtype(args[3]->Uint32Value());
        return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::iota(dims, titleDims, type.first))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Diag)
{
    NanScope();

    try
    {
        if (args.Length() < 2)
        {
            return NanThrowInvalidNumberOfArgumentsError();
        }
        auto pArray = ArrayWrapper::GetArrayAt(args, 0);
        int num = 0;
        bool extract = true;
        if (args.Length() > 1)
        {
            num = args[1]->Int32Value();
        }
        if (args.Length() > 2)
        {
            extract = args[2]->BooleanValue();
        }
        af::array array(*pArray);
        return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::diag(array, num, extract))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Constant)
{
    NanScope();

    // Notice: In v8 we can go for double, complex, and int64 as a string, because v8 numbers are doubles.

    try
    {
        if (args.Length() < 4)
        {
            return NanThrowInvalidNumberOfArgumentsError();
        }
        auto dimAndType = ParseDimAndTypeArgs(args, -1, 0, 1);
        auto value = args[0];
        if (value->IsNumber())
        {
            if (af::isDoubleAvailable(af::getDevice()))
            {
                double v = value->NumberValue();
                return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::constant(v, dimAndType.first, dimAndType.second))); });
            }
            else
            {
                float v = (float)value->NumberValue();
                return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::constant(v, dimAndType.first, dimAndType.second))); });
            }
        }
        else if (value->IsObject())
        {
            if (af::isDoubleAvailable(af::getDevice()))
            {
                auto v = ToDComplex(value);
                return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::constant(v, dimAndType.first, dimAndType.second))); });
            }
            else
            {
                auto v = ToFComplex(value);
                return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::constant(v, dimAndType.first, dimAndType.second))); });
            }
        }
        else if (value->IsString())
        {
            String::Utf8Value str(value);
            intl val = strtoll(*str, nullptr, 10);
            return ArrayWrapper::NewAsync(args, [=]() { return new af::array(move(af::constant(val, dimAndType.first, dimAndType.second))); });
        }
        else
        {
            throw new logic_error("Argument at position 0 is not a constant.");
        }

    }
    FIRE_CATCH
}

void InitCreateArray(v8::Handle<v8::Object> exports)
{
    //exports->Set(NanNew<String>("getDeviceCount"), NanNew<FunctionTemplate>(GetDeviceCount)->GetFunction());
}
