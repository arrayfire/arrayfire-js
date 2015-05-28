#include "ext.h"
#include "arraywrapper.h"
#include "helpers.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;
using namespace node;

Persistent<Function> ArrayWrapper::constructor;

ArrayWrapper::ArrayWrapper()
{
}

ArrayWrapper::ArrayWrapper(const af::array &array) :
    array(array)
{
}

ArrayWrapper::ArrayWrapper(af::array &&array) :
    array(move(array))
{
}

void ArrayWrapper::Init(v8::Local<v8::Object> exports)
{
    auto tmpl = NanNew<FunctionTemplate>(New);
    tmpl->SetClassName(NanNew("AFArray"));

    int noOfMethods = 21;
    tmpl->InstanceTemplate()->SetInternalFieldCount(noOfMethods);
    NanSetPrototypeTemplate(tmpl, NanNew("elements"), NanNew<FunctionTemplate>(Elements), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("host"), NanNew<FunctionTemplate>(Host), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("type"), NanNew<FunctionTemplate>(Type), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("dims"), NanNew<FunctionTemplate>(Dims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("numdims"), NanNew<FunctionTemplate>(NumDims), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("bytes"), NanNew<FunctionTemplate>(Bytes), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("copy"), NanNew<FunctionTemplate>(Copy), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isempty"), NanNew<FunctionTemplate>(IsEmpty), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isscalar"), NanNew<FunctionTemplate>(IsScalar), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isvector"), NanNew<FunctionTemplate>(IsVector), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isrow"), NanNew<FunctionTemplate>(IsRow), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("iscolumn"), NanNew<FunctionTemplate>(IsColumn), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("iscomplex"), NanNew<FunctionTemplate>(IsComplex), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isreal"), NanNew<FunctionTemplate>(IsReal), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isdouble"), NanNew<FunctionTemplate>(IsDouble), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("issingle"), NanNew<FunctionTemplate>(IsSingle), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isrealfloating"), NanNew<FunctionTemplate>(IsRealFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isfloating"), NanNew<FunctionTemplate>(IsFloating), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isinteger"), NanNew<FunctionTemplate>(IsInteger), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("isbool"), NanNew<FunctionTemplate>(IsBool), v8::ReadOnly);
    NanSetPrototypeTemplate(tmpl, NanNew("eval"), NanNew<FunctionTemplate>(Eval), v8::ReadOnly);

    NanAssignPersistent<Function>(constructor, tmpl->GetFunction());
    exports->Set(NanNew("AFArray"), tmpl->GetFunction());
}

v8::Local<Object> ArrayWrapper::New(const af::array& array)
{
    Local<Value> args[] = { NanNewBufferHandle(reinterpret_cast<char*>(new af::array(array)), 0, [](char*v1,void*v2) {}, nullptr) };
    auto c = NanNew(constructor);
    return c->NewInstance(1, args);
}

v8::Local<Object> ArrayWrapper::New(af::array&& array)
{
    auto p1 = reinterpret_cast<char*>(new af::array(move(array)));
    Local<Value> args[] = { NanNewBufferHandle(p1, 0, [](char*v1,void*v2) {}, nullptr) };
    auto p2 = Buffer::Data(args[0]);
    auto c = NanNew(constructor);
    return c->NewInstance(1, args);
}

void ArrayWrapper::New(const v8::FunctionCallbackInfo<v8::Value> &args)
{
    NanScope();

    int buffIdx = -1;
    ArrayWrapper* instance = nullptr;
    try
    {
        if (args.Length() == 0)
        {
            instance = new ArrayWrapper();
        }
        else if (args.Length() == 1)
        {
            if (Buffer::HasInstance(args[0]))
            {
                auto arrayPtr = reinterpret_cast<af::array*>((uintptr_t)Buffer::Data(args[0]));
                instance = new ArrayWrapper(move(*arrayPtr));
                delete arrayPtr;
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
                int dimensions = args.Length() - 1;
                af::dtype type = ConvDtype(args[args.Length() - 1]->Uint32Value()).first;
                switch(dimensions)
                {
                    case 1:
                        instance = new ArrayWrapper(af::array((dim_type)args[0]->Int32Value(), type));
                        break;
                    case 2:
                        instance = new ArrayWrapper(af::array((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), type));
                        break;
                    case 3:
                        instance = new ArrayWrapper(af::array((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), type));
                        break;
                    case 4:
                        {
                            af::dim4 d((dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), (dim_type)args[3]->Int32Value());
                            instance = new ArrayWrapper(af::array(d, type));
                        }
                        break;
                }
            }
            else if (buffIdx + 1 < args.Length())
            {
                // Copy / wrap ptr
                // args: dim0..dimn, ptr, dtype[, source]
                af::af_source_t src = af::afHost;
                if (buffIdx + 2 < args.Length())
                {
                    src = (af::af_source_t)(args[buffIdx + 2]->Int32Value());
                }
                int dimensions = buffIdx;
                af::dtype type = ConvDtype(args[buffIdx + 1]->Uint32Value()).first;
                auto buffObj = args[buffIdx]->ToObject();
                char* ptr = Buffer::Data(buffObj);
                af_array handle;
                af_err err;
                vector<dim_type> dims;
                switch(dimensions)
                {
                    case 1:
                        dims = { (dim_type)args[0]->Int32Value() };
                        break;
                    case 2:
                        dims = { (dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value() };
                        break;
                    case 3:
                        dims = { (dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value() };
                        break;
                    case 4:
                        dims = { (dim_type)args[0]->Int32Value(), (dim_type)args[1]->Int32Value(), (dim_type)args[2]->Int32Value(), (dim_type)args[3]->Int32Value() };
                        break;
                }
                if (dims.size())
                {
                    if (src == af::afHost)
                    {
                        err = af_device_array(&handle, ptr, dimensions, &dims[0], type);
                    }
                    else
                    {
                        err = af_create_array(&handle, ptr, dimensions, &dims[0], type);
                    }
                    if (err)
                    {
                        return NanThrowError(ErrToString(err).c_str());
                    }
                    instance = new ArrayWrapper(af::array(handle));
                }
            }
        }
    }
    catch(exception& ex)
    {
        delete instance;
        NanThrowError(ex.what());
    }

    if (!instance)
    {
        return NanThrowError("Invalid arguments.");
    }

    instance->Wrap(args.Holder());

    //Set instance props: NanObjectWrapHandle(obj)->Set(NanNew(symbol), value);

    NanReturnValue(args.Holder());
}

NAN_METHOD(ArrayWrapper::Elements)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.elements()));
}

NAN_METHOD(ArrayWrapper::Host)
{
    NanScope();

    if (!(args.Length() && Buffer::HasInstance(args[0])))
    {
        return NanThrowError("Buffer argument expected.");
    }

    auto buffSize = Buffer::Length(args[0]);
    auto buffData = Buffer::Data(args[0]);

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    if (buffSize < obj->array.bytes())
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
        array.host(buffData);
    };
    auto worker = new Worker<void>(callback, exec);
    worker->SaveToPersistent("data", args[0]->ToObject());

    NanAsyncQueueWorker(worker);
    NanReturnUndefined();
}

NAN_METHOD(ArrayWrapper::Type)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(obj->array.type());
}

NAN_METHOD(ArrayWrapper::Dims)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    if (!args.Length())
    {
        auto dims = obj->array.dims();
        auto jsDims = NanNew<Object>();
        jsDims->Set(NanNew("elements"), NanNew(dims.elements()));
        jsDims->Set(NanNew("ndims"), NanNew(dims.ndims()));
        jsDims->Set(NanNew("dim0"), NanNew(dims[0]));
        jsDims->Set(NanNew("dim1"), NanNew(dims[1]));
        jsDims->Set(NanNew("dim2"), NanNew(dims[2]));
        jsDims->Set(NanNew("dim3"), NanNew(dims[3]));

        NanReturnValue(jsDims);
    }
    else
    {
        NanReturnValue(obj->array.dims(args[0]->Uint32Value()));
    }
}

NAN_METHOD(ArrayWrapper::NumDims)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.numdims()));
}

NAN_METHOD(ArrayWrapper::Bytes)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew<Number>((unsigned)obj->array.bytes()));
}

NAN_METHOD(ArrayWrapper::Copy)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    auto result = New(move(obj->array.copy()));

    NanReturnValue(result);
}

NAN_METHOD(ArrayWrapper::IsEmpty)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isempty()));
}

NAN_METHOD(ArrayWrapper::IsScalar)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isscalar()));
}

NAN_METHOD(ArrayWrapper::IsVector)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isvector()));
}

NAN_METHOD(ArrayWrapper::IsRow)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isrow()));
}

NAN_METHOD(ArrayWrapper::IsColumn)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.iscolumn()));
}

NAN_METHOD(ArrayWrapper::IsComplex)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.iscomplex()));
}

NAN_METHOD(ArrayWrapper::IsReal)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isreal()));
}

NAN_METHOD(ArrayWrapper::IsDouble)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isdouble()));
}

NAN_METHOD(ArrayWrapper::IsSingle)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.issingle()));
}

NAN_METHOD(ArrayWrapper::IsRealFloating)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isrealfloating()));
}

NAN_METHOD(ArrayWrapper::IsFloating)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isfloating()));
}

NAN_METHOD(ArrayWrapper::IsInteger)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.isinteger()));
}

NAN_METHOD(ArrayWrapper::IsBool)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());

    NanReturnValue(NanNew(obj->array.type() == b8));
}

NAN_METHOD(ArrayWrapper::Eval)
{
    NanScope();
    Guard();

    auto obj = ObjectWrap::Unwrap<ArrayWrapper>(args.This());
    obj->array.eval();

    NanReturnUndefined();
}
