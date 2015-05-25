#include "ext.h"
#include "af.h"
#include "device.h"

using namespace v8;
using namespace af;

void init(v8::Handle<v8::Object> exports)
{
    initDevice(exports);
}
