#include "ext.h"
#include "helpers.h"
#include "errors.h"

using namespace std;
using namespace v8;
using namespace node;

pair<af::dtype, unsigned> ConvDtype(unsigned udtype)
{
    unsigned sizeOf;
    af::dtype dtype;
    switch (udtype)
    {
        case 0:
            dtype = f32;
            sizeOf = 32 / 8;
            break;
        case 1:
            dtype = c32;
            sizeOf = 32 / 8;
            break;
        case 2:
            dtype = f64;
            sizeOf = 64 / 8;
            break;
        case 3:
            dtype = c64;
            sizeOf = 64 / 8;
            break;
        case 4:
            dtype = b8;
            sizeOf = 8 / 8;
            break;
        case 5:
            dtype = s32;
            sizeOf = 32 / 8;
            break;
        case 6:
            dtype = u32;
            sizeOf = 32 / 8;
            break;
        case 7:
            dtype = u8;
            sizeOf = 8 / 8;
            break;
        case 8:
            dtype = s64;
            sizeOf = 64 / 8;
            break;
        case 9:
            dtype = u64;
            sizeOf = 64 / 8;
            break;
        default:
            throw logic_error("DType is out of range.");
    }
    return move(make_pair(dtype, sizeOf));
}

string ErrToString(af_err err)
{
    switch (err)
    {
        case AF_ERR_INTERNAL:
            return "Internal error (AF_ERR_INTERNAL).";
            break;
        case AF_ERR_NOMEM:
            return "Not enough memory error (AF_ERR_NOMEM).";
            break;
        case AF_ERR_DRIVER:
            return "Driver error (AF_ERR_DRIVER).";
            break;
        case AF_ERR_RUNTIME:
            return "Runtime error (AF_ERR_RUNTIME).";
            break;
        case AF_ERR_INVALID_ARRAY:
            return "Invalid array error (AF_ERR_INVALID_ARRAY).";
            break;
        case AF_ERR_ARG:
            return "Argument error (AF_ERR_ARG).";
            break;
        case AF_ERR_SIZE:
            return "Size error (AF_ERR_SIZE).";
            break;
        case AF_ERR_DIFF_TYPE:
            return "Diff type error (AF_ERR_DIFF_TYPE).";
            break;
        case AF_ERR_NOT_SUPPORTED:
            return "Operation is not supported (AF_ERR_NOT_SUPPORTED).";
            break;
        case AF_ERR_NOT_CONFIGURED:
            return "Not configured error (AF_ERR_NOT_CONFIGURED).";
            break;
        case AF_ERR_INVALID_TYPE:
            return "Invalid type error (AF_ERR_INVALID_TYPE).";
            break;
        case AF_ERR_INVALID_ARG:
            return "Invalid argument error (AF_ERR_INVALID_ARG).";
            break;
        default:
            return "Uknown ArrayFire error (AF_ERR_UNKNOWN).";
    };
}

v8::Local<v8::Object> WrapPointer(void* ptr)
{
    return NanNewBufferHandle(reinterpret_cast<char*>(ptr), 0, [](char*v1, void*v2) {}, nullptr);
}

af::dim4 ToDim4(v8::Local<v8::Object> obj)
{
    Local<Array> dims;
    if (obj->IsArray())
    {
        dims = obj.As<Array>();
    }
    else
    {
        auto member = obj->Get(NanNew("dims")); // TODO: Create symbol table on init
        if (member->IsArray())
        {
            dims = member.As<Array>();
        }
        else
        {
            throw logic_error("Argument is not a dim4 object.");
        }
    }
    int dim0 = 1;
    int dim1 = 1;
    int dim2 = 1;
    int dim3 = 1;
    if (dims->Length() > 0)
    {
        dim0 = dims->Get(0)->Uint32Value();
    }
    if (dims->Length() > 1)
    {
        dim1 = dims->Get(1)->Uint32Value();
    }
    if (dims->Length() > 2)
    {
        dim2 = dims->Get(2)->Uint32Value();
    }
    if (dims->Length() > 3)
    {
        dim3 = dims->Get(3)->Uint32Value();
    }
    return move(af::dim4(dim0, dim1, dim2, dim3));
}

af::dim4 ToDim4(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToDim4(value.As<Object>());
    }
    throw GetArgumentIsNotAnObjectException();
}

af::seq ToSeq(v8::Local<v8::Object> obj)
{
    auto begin = obj->Get(NanNew("begin")); // TODO: Create symbol table on init
    auto end = obj->Get(NanNew("end")); // TODO: Create symbol table on init
    auto step = obj->Get(NanNew("step")); // TODO: Create symbol table on init
    if (begin->IsNumber() && begin->IsNumber())
    {
        double stepValue = 1;
        if (step->IsNumber())
        {
            stepValue = step->NumberValue();
        }
        return move(af::seq(begin->NumberValue(), end->NumberValue(), stepValue));
    }
    throw GetArgumentIsNotASeqException();
}

af::seq ToSeq(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToSeq(value.As<Object>());
    }
    throw GetArgumentIsNotAnObjectException();
}

std::complex<double> ToDComplex(v8::Local<v8::Object> obj)
{
    auto imag = obj->Get(NanNew("imag")); // TODO: Create symbol table on init
    auto real = obj->Get(NanNew("real")); // TODO: Create symbol table on init
    if (imag->IsNumber() && real->IsNumber())
    {
        return move(complex<double>(real->NumberValue(), imag->NumberValue()));
    }
    throw GetArgumentIsNotAComplexException();
}

std::complex<double> ToDComplex(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToDComplex(value.As<Object>());
    }
    throw GetArgumentIsNotAnObjectException();
}

std::complex<float> ToFComplex(v8::Local<v8::Object> obj)
{
    auto imag = obj->Get(NanNew("imag")); // TODO: Create symbol table on init
    auto real = obj->Get(NanNew("real")); // TODO: Create symbol table on init
    if (imag->IsNumber() && real->IsNumber())
    {
        return move(complex<float>((float)real->NumberValue(), (float)imag->NumberValue()));
    }
    throw GetArgumentIsNotAComplexException();
}

std::complex<float> ToFComplex(v8::Local<v8::Value> value)
{
    if (value->IsObject())
    {
        return ToFComplex(value.As<Object>());
    }
    throw GetArgumentIsNotAnObjectException();
}

std::pair<af::dim4, af::dtype> ParseDimAndTypeArgs(const v8::FunctionCallbackInfo<v8::Value>& args, int assumedArgsLength, int argsFollowingDims, int dimsStartAt)
{
    if (assumedArgsLength == -1)
    {
        assumedArgsLength = args.Length();
        if (args[assumedArgsLength - 1]->IsFunction())
        {
            // Async
            assumedArgsLength--;
        }
    }
    af::dim4 dims(1, 1, 1, 1);
    bool any = false;
    for (int idx = dimsStartAt; idx < ((assumedArgsLength - 1) - argsFollowingDims) + dimsStartAt; idx++)
    {
        int dimIdx = idx - dimsStartAt;
        assert(dimIdx < 4);
        any = true;
        if (dimIdx == 0 && args[0]->IsObject())
        {
            dims = move(ToDim4(args[0].As<Object>()));
            break;
        }
        dims[dimIdx] = args[idx]->Int32Value();
    }
    if (any)
    {
        af::dtype type = ConvDtype(args[assumedArgsLength - 1 + dimsStartAt]->Uint32Value()).first;
        return move(make_pair(move(dims), type));
    }
    throw logic_error("Cannot extract dimensions and dtype from argumens.");
}
