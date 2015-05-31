#include "ext.h"
#include "arraywrapper.h"
#include "helpers.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;
using namespace node;

Persistent<Function> ArrayWrapper::constructor;

ArrayWrapper::ArrayWrapper(af::array* array) :
    array(array)
{
    assert(array);
}

ArrayWrapper::~ArrayWrapper()
{
    delete array;
}

void ArrayWrapper::Init(v8::Local<v8::Object> exports)
{
    auto tmpl = NanNew<FunctionTemplate>(New);
    tmpl->SetClassName(NanNew("AFArray"));

    int noOfMethods = 21;
    tmpl->InstanceTemplate()->SetInternalFieldCount(noOfMethods);
    NanSetPrototypeTemplate(tmpl, NanNew("elements"), NanNew<FunctionTemplate>(Elements), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("host"), NanNew<FunctionTemplate>(Host), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("copyToHost"), NanNew<FunctionTemplate>(Host), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("type"), NanNew<FunctionTemplate>(Type), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("dims"), NanNew<FunctionTemplate>(Dims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("numdims"), NanNew<FunctionTemplate>(NumDims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("numDims"), NanNew<FunctionTemplate>(NumDims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bytes"), NanNew<FunctionTemplate>(Bytes), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("copy"), NanNew<FunctionTemplate>(Copy), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isempty"), NanNew<FunctionTemplate>(IsEmpty), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isEmpty"), NanNew<FunctionTemplate>(IsEmpty), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isscalar"), NanNew<FunctionTemplate>(IsScalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isScalar"), NanNew<FunctionTemplate>(IsScalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isvector"), NanNew<FunctionTemplate>(IsVector), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isVector"), NanNew<FunctionTemplate>(IsVector), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isrow"), NanNew<FunctionTemplate>(IsRow), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isRow"), NanNew<FunctionTemplate>(IsRow), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("iscolumn"), NanNew<FunctionTemplate>(IsColumn), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isColumn"), NanNew<FunctionTemplate>(IsColumn), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("iscomplex"), NanNew<FunctionTemplate>(IsComplex), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isComplex"), NanNew<FunctionTemplate>(IsComplex), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isreal"), NanNew<FunctionTemplate>(IsReal), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isReal"), NanNew<FunctionTemplate>(IsReal), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isdouble"), NanNew<FunctionTemplate>(IsDouble), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isDouble"), NanNew<FunctionTemplate>(IsDouble), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("issingle"), NanNew<FunctionTemplate>(IsSingle), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isSingle"), NanNew<FunctionTemplate>(IsSingle), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isrealfloating"), NanNew<FunctionTemplate>(IsRealFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isRealFloating"), NanNew<FunctionTemplate>(IsRealFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isfloating"), NanNew<FunctionTemplate>(IsFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isFloating"), NanNew<FunctionTemplate>(IsFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isinteger"), NanNew<FunctionTemplate>(IsInteger), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isInteger"), NanNew<FunctionTemplate>(IsInteger), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isbool"), NanNew<FunctionTemplate>(IsBool), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isBool"), NanNew<FunctionTemplate>(IsBool), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("eval"), NanNew<FunctionTemplate>(Eval), v8::ReadOnly);

    auto f = tmpl->GetFunction();
    f->Set(NanNew("create"), NanNew<FunctionTemplate>(Create)->GetFunction());
    NanAssignPersistent<Function>(constructor, f);
    exports->Set(NanNew("AFArray"), f);
}

v8::Local<Object> ArrayWrapper::New(af::array* array)
{
    Local<Value> args[] = { WrapPointer(array) };
    auto c = NanNew(constructor);
    auto inst = c->NewInstance(1, args);
    assert(ObjectWrap::Unwrap<ArrayWrapper>(inst)->array == array);
    return inst;
}

template<typename T>
af::array* ArrayWrapper::CreateArray(void* ptr, af::af_source_t src, int dimensions, const vector<dim_type> &dims)
{
    Guard();
    switch (dimensions)
    {
        case 1:
            return new af::array(dims[0], (T*)ptr, src);
            break;
        case 2:
            return new af::array(dims[0], dims[1], (T*)ptr, src);
            break;
        case 3:
            return new af::array(dims[0], dims[1], dims[2], (T*)ptr, src);
            break;
        case 4:
            {
                return new af::array(af::dim4(dims[0], dims[1], dims[2], dims[3]), (T*)ptr, src);
            }
            break;
    }
    return nullptr;
}

void ArrayWrapper::New(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    NanScope();

    try
    {
        ArrayWrapper* instance = nullptr;
        int buffIdx = -1;
        try
        {
            if (args.Length() == 0)
            {
                instance = new ArrayWrapper(new af::array());
            }
            else if (args.Length() == 1)
            {
                if (Buffer::HasInstance(args[0]))
                {
                    instance = new ArrayWrapper(reinterpret_cast<af::array*>(Buffer::Data(args[0])));
                }
            }
            else
            {
                for (int i = 0; i < args.Length(); i++)
                {
                    if (Buffer::HasInstance(args[i]))
                    {
                        buffIdx = i;
                        break;
                    }
                }

                if (buffIdx == -1)
                {
                    // Creating new
                    af::dtype type = ConvDtype(args[args.Length() - 1]->Uint32Value()).first;
                    if (args.Length() == 2 && args[0]->IsObject())
                    {
                        instance = new ArrayWrapper(new af::array(ToDim4(args[0].As<Object>()), type));
                    }
                    else
                    {
                        int dimensions = args.Length() - 1;
                        switch (dimensions)
                        {
                            case 1:
                                instance = new ArrayWrapper(new af::array((dim_type)args[0]->Int32Value(), type));
                                break;
                            case 2:
                                instance = new ArrayWrapper(new af::array((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), type));
                                break;
                            case 3:
                                instance = new ArrayWrapper(new af::array((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), type));
                                break;
                            case 4:
                                {
                                    af::dim4 d((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), (dim_type)args[3]->Int32Value());
                                    instance = new ArrayWrapper(new af::array(d, type));
                                }
                                break;
                        }
                    }
                }
            }
        }
        catch (...)
        {
            delete instance;
            throw;
        }

        if (!instance)
        {
            return NanThrowError("Invalid arguments.");
        }

        instance->Wrap(args.Holder());

        //Set instance props: NanObjectWrapHandle(obj)->Set(NanNew(symbol), value);

        NanReturnValue(args.Holder());
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Create)
{
    NanScope();

    try
    {
        int buffIdx = -1;
        function<af::array*()> factory;

        for (int i = 0; i < args.Length(); i++)
        {
            if (Buffer::HasInstance(args[i]))
            {
                buffIdx = i;
                break;
            }
        }

        if (buffIdx == -1)
        {
            return NanThrowError("Buffer argument expected.");
        }
        else if (buffIdx + 1 < args.Length())
        {
            // Copy / wrap ptr
            // args: dim0..dimn, ptr, dtype[, source]
            af::af_source_t src = af::afHost;
            if (buffIdx + 2 < args.Length() && args[buffIdx + 2]->IsNumber())
            {
                src = (af::af_source_t)(args[buffIdx + 2]->Int32Value());
            }
            int dimensions = buffIdx;
            af::dtype type = ConvDtype(args[buffIdx + 1]->Uint32Value()).first;
            auto buffObj = args[buffIdx]->ToObject();
            char* ptr = Buffer::Data(buffObj);
            vector<dim_type> dims = { args[0]->Int32Value() };
            if (dimensions > 1)  dims.push_back(args[1]->Int32Value());
            if (dimensions > 2)  dims.push_back(args[2]->Int32Value());
            if (dimensions > 3)  dims.push_back(args[3]->Int32Value());
            switch (type)
            {
                case f32:
                    factory = [=]() { return CreateArray<float>(ptr, src, dimensions, dims); };
                    break;
                case f64:
                    factory = [=]() { return CreateArray<double>(ptr, src, dimensions, dims); };
                    break;
                case s32:
                    factory = [=]() { return CreateArray<int>(ptr, src, dimensions, dims); };
                    break;
                case u32:
                    factory = [=]() { return CreateArray<unsigned>(ptr, src, dimensions, dims); };
                    break;
                case u8:
                    factory = [=]() { return CreateArray<unsigned char>(ptr, src, dimensions, dims); };
                    break;
                case c32:
                    factory = [=]() { return CreateArray<af_cfloat>(ptr, src, dimensions, dims); };
                    break;
                case c64:
                    factory = [=]() { return CreateArray<af_cdouble>(ptr, src, dimensions, dims); };
                    break;
                case b8:
                    factory = [=]() { return CreateArray<char>(ptr, src, dimensions, dims); };
                    break;
                case s64:
                    factory = [=]() { return CreateArray<int64_t>(ptr, src, dimensions, dims); };
                    break;
                case u64:
                    factory = [=]() { return CreateArray<uint64_t>(ptr, src, dimensions, dims); };
                    break;
            }
        }

        if (!factory)
        {
            return NanThrowError("Invalid arguments.");
        }

        NanCallback *callback = nullptr;
        if (args[args.Length() - 1]->IsFunction())
        {
            callback = new NanCallback(args[args.Length() - 1].As<Function>());
        }

        if (!callback)
        {
            return NanThrowError("Callback argument expected.");
        }

        auto conv = [](af::array* w)
        {
            return New(w);
        };
        auto worker = new Worker<af::array*>(callback, move(factory), move(conv));
        worker->SaveToPersistent("data", args[buffIdx]->ToObject());

        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Elements)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->elements()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Host)
{
    NanScope();

    try
    {
        if (!(args.Length() && Buffer::HasInstance(args[0])))
        {
            return NanThrowError("Buffer argument expected.");
        }

        auto buffSize = Buffer::Length(args[0]);
        auto buffData = Buffer::Data(args[0]);

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
        if (buffSize < obj->array->bytes())
        {
            return NanThrowError("Buffer is too small to hold values.");
        }

        NanCallback *callback = nullptr;
        if (args.Length() > 1 && args[1]->IsFunction())
        {
            callback = new NanCallback(args[1].As<Function>());
        }

        if (!callback)
        {
            return NanThrowError("Callback argument expected.");
        }

        auto array = obj->array;
        auto exec = [=]()
        {
            Guard();
            array->host(buffData);
        };
        auto worker = new Worker<void>(callback, move(exec));
        worker->SaveToPersistent("data", args[0]->ToObject());

        NanAsyncQueueWorker(worker);
        NanReturnUndefined();
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Type)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(obj->array->type());
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Dims)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
        if (!args.Length())
        {
            auto dims = obj->array->dims();
            auto jsDims = NanNew<Object>();
            jsDims->Set(NanNew("elements"), NanNew(dims.elements()));
            jsDims->Set(NanNew("ndims"), NanNew(dims.ndims()));
            jsDims->Set(NanNew("dim0"), NanNew(dims[0]));
            jsDims->Set(NanNew("dim1"), NanNew(dims[1]));
            jsDims->Set(NanNew("dim2"), NanNew(dims[2]));
            jsDims->Set(NanNew("dim3"), NanNew(dims[3]));
            auto pDims = NanNew<Array>(4);
            pDims->Set(0, NanNew(dims[0]));
            pDims->Set(1, NanNew(dims[1]));
            pDims->Set(2, NanNew(dims[2]));
            pDims->Set(3, NanNew(dims[3]));
            jsDims->Set(NanNew("dims"), pDims);

            NanReturnValue(jsDims);
        }
        else
        {
            NanReturnValue(obj->array->dims(args[0]->Uint32Value()));
        }
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::NumDims)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->numdims()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Bytes)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew<Number>((unsigned)obj->array->bytes()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Copy)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
        auto result = New(new af::array(obj->array->copy()));

        NanReturnValue(result);
    }
    FIRE_CATCH;
}

NAN_METHOD(ArrayWrapper::IsEmpty)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isempty()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsScalar)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isscalar()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsVector)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isvector()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRow)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isrow()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsColumn)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->iscolumn()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsComplex)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->iscomplex()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsReal)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isreal()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsDouble)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isdouble()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsSingle)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->issingle()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsRealFloating)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isrealfloating()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsFloating)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isfloating()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsInteger)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->isinteger()));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::IsBool)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

        NanReturnValue(NanNew(obj->array->type() == b8));
    }
    FIRE_CATCH
}

NAN_METHOD(ArrayWrapper::Eval)
{
    NanScope();

    try
    {
        Guard();

        auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
        obj->array->eval();

        NanReturnUndefined();
    }
    FIRE_CATCH
}
