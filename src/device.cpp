#include "ext.h"
#include "device.h"
#include "guard.h"
#include "worker.h"

using namespace v8;
using namespace std;

NAN_METHOD(getDeviceCount)
{
    Guard lock;
    NanScope();
    NanReturnValue(NanNew<Number>(af::getDeviceCount()));
}

NAN_METHOD(getDevice)
{
    Guard lock;
    NanScope();

    NanReturnValue(NanNew<Number>(af::getDevice()));
}

NAN_METHOD(setDevice)
{
    Guard lock;
    NanScope();

    af::setDevice(args[0]->Uint32Value());
    NanReturnUndefined();
}

NAN_METHOD(getDeviceInfo)
{
    Guard lock;
    NanScope();

    char name[256], platform[256], toolkit[256], compute[256];
    af::deviceprop(name, platform, toolkit, compute);
    bool isDoubleAvailable = af::isDoubleAvailable(af::getDevice());
    auto info = NanNew<Object>();
    info->Set(NanNew<String>("name"), NanNew<String>(name));
    info->Set(NanNew<String>("platform"), NanNew<String>(platform));
    info->Set(NanNew<String>("toolkit"), NanNew<String>(toolkit));
    info->Set(NanNew<String>("compute"), NanNew<String>(compute));
    info->Set(NanNew<String>("isDoubleAvailable"), NanNew<Boolean>(isDoubleAvailable));
    NanReturnValue(info);
}

NAN_METHOD(isDoubleAvailable)
{
    Guard lock;
    NanScope();

    NanReturnValue(NanNew<Number>(af::isDoubleAvailable(args[0]->Uint32Value())));
}

NAN_METHOD(sync)
{
    Guard lock;
    NanScope();

    int device = args[0]->Int32Value();
    auto cb = new NanCallback(Local<Function>::Cast(args[1]));
    auto worker = Worker::getInstance();

    auto work = [=]()
    {
        Guard lock;
        af::sync(device);
    };

    auto workDone = [=](const string& errorMessage)
    {
        Handle<Value> argv[] =
        {
            Exception::Error(NanNew<String>(errorMessage.c_str()))
        };
        try
        {
            cb->Call(1, argv);
        }
        catch (...)
        {
        }
        delete cb;
    };

    worker->queue(work, workDone);

    NanReturnUndefined();
}

void initDevice(v8::Handle<v8::Object> exports)
{
    exports->Set(NanNew<String>("getDeviceCount"), NanNew<FunctionTemplate>(getDeviceCount)->GetFunction());
    exports->Set(NanNew<String>("getDevice"), NanNew<FunctionTemplate>(getDevice)->GetFunction());
    exports->Set(NanNew<String>("setDevice"), NanNew<FunctionTemplate>(setDevice)->GetFunction());
    exports->Set(NanNew<String>("getDeviceInfo"), NanNew<FunctionTemplate>(getDeviceInfo)->GetFunction());
    exports->Set(NanNew<String>("isDoubleAvailable"), NanNew<FunctionTemplate>(isDoubleAvailable)->GetFunction());
}
