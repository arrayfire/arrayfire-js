#include "ext.h"
#include "createarray.h"
#include "helpers.h"
#include "arraywrapper.h"
#include "errors.h"
#include "guard.h"

using namespace v8;
using namespace std;
using namespace node;

// TODO: RND seed functions, when 3.0 gets released

NAN_METHOD(RandU)
{
    NanScope();

    try
    {
        FIRE_THROW("anyad");
        auto dimAndType = ParseDimAndTypeArgs(args);
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::randu(dimAndType.first, dimAndType.second))); });
    }
    FIRE_CATCH
}

NAN_METHOD(RandN)
{
    NanScope();

    try
    {
        auto dimAndType = ParseDimAndTypeArgs(args);
        if (dimAndType.second == f32 || dimAndType.second == f64)
        {
            return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::randn(dimAndType.first, dimAndType.second))); });
        }
        return NAN_THROW_INVALID_DTYPE();
    }
    FIRE_CATCH
}

NAN_METHOD(Identity)
{
    NanScope();

    try
    {
        auto dimAndType = ParseDimAndTypeArgs(args);
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::identity(dimAndType.first, dimAndType.second))); });
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
            return NAN_THROW_INVALID_NO_OF_ARGS();
        }
        auto dimAndType = ParseDimAndTypeArgs(args, -1, 1);
        dim_type seqDim = args[args.Length() - 3]->Uint32Value();
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::range(dimAndType.first, seqDim, dimAndType.second))); });
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
            return NAN_THROW_INVALID_NO_OF_ARGS();
        }
        auto dims = ToDim4(args[0]);
        auto titleDims = ToDim4(args[1]);
        auto type = ConvDtype(args[3]->Uint32Value());
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::iota(dims, titleDims, type.first))); });
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
            return NAN_THROW_INVALID_NO_OF_ARGS();
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
        return ArrayWrapper::NewAsync(args, [=]() { Guard(); return new af::array(move(af::diag(array, num, extract))); });
    }
    FIRE_CATCH
}

NAN_METHOD(Constant)
{
    NanScope();

    // Notice: In v8 we can go for double, complex, and int64 as a string, because v8 numbers are doubles.

    try
    {
        if (args.Length() < 3)
        {
            return NAN_THROW_INVALID_NO_OF_ARGS();
        }
        auto dimAndType = ParseDimAndTypeArgs(args, -1, 0, 1);
        auto value = args[0];
        if (value->IsNumber())
        {
            if (af::isDoubleAvailable(af::getDevice()))
            {
                double v = value->NumberValue();
                NanReturnValue(ArrayWrapper::New(new af::array(move(af::constant(v, dimAndType.first, dimAndType.second)))));
            }
            else
            {
                float v = (float)value->NumberValue();
                NanReturnValue(ArrayWrapper::New(new af::array(move(af::constant(v, dimAndType.first, dimAndType.second)))));
            }
        }
        else if (value->IsObject())
        {
            if (af::isDoubleAvailable(af::getDevice()))
            {
                auto v = ToDComplex(value);
                NanReturnValue(ArrayWrapper::New(new af::array(move(af::constant(v, dimAndType.first, dimAndType.second)))));
            }
            else
            {
                auto v = ToFComplex(value);
                NanReturnValue(ArrayWrapper::New(new af::array(move(af::constant(v, dimAndType.first, dimAndType.second)))));
            }
        }
        else if (value->IsString())
        {
            String::Utf8Value str(value);
            intl val = strtoll(*str, nullptr, 10);
            NanReturnValue(ArrayWrapper::New(new af::array(move(af::constant(val, dimAndType.first, dimAndType.second)))));
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
    exports->Set(NanNew<String>("randu"), NanNew<FunctionTemplate>(RandU)->GetFunction());
    exports->Set(NanNew<String>("randU"), NanNew<FunctionTemplate>(RandU)->GetFunction());
    exports->Set(NanNew<String>("randn"), NanNew<FunctionTemplate>(RandN)->GetFunction());
    exports->Set(NanNew<String>("randN"), NanNew<FunctionTemplate>(RandN)->GetFunction());
    exports->Set(NanNew<String>("identity"), NanNew<FunctionTemplate>(Identity)->GetFunction());
    exports->Set(NanNew<String>("range"), NanNew<FunctionTemplate>(Range)->GetFunction());
    exports->Set(NanNew<String>("iota"), NanNew<FunctionTemplate>(Iota)->GetFunction());
    exports->Set(NanNew<String>("diag"), NanNew<FunctionTemplate>(Diag)->GetFunction());
    exports->Set(NanNew<String>("constant"), NanNew<FunctionTemplate>(Constant)->GetFunction());
}
