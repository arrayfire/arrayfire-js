#include "ext.h"
#include "arrayorproxyholder.h"

using namespace v8;
using namespace std;
using namespace node;

ArrayOrProxyHolder::ArrayOrProxyHolder(af::array* array) :
    _array(array),
    _arrayProxy(nullptr)
{
    assert(array);
}

ArrayOrProxyHolder::ArrayOrProxyHolder(const af::array& array) :
    _array(new af::array(array)),
    _arrayProxy(nullptr)
{
}

ArrayOrProxyHolder::ArrayOrProxyHolder(af::array::array_proxy* arrayProxy) :
    _array(nullptr),
    _arrayProxy(arrayProxy)
{
    assert(arrayProxy);
}

ArrayOrProxyHolder::ArrayOrProxyHolder(const af::array::array_proxy& arrayProxy) :
    _array(nullptr),
    _arrayProxy(new af::array::array_proxy(arrayProxy))
{
}

ArrayOrProxyHolder::~ArrayOrProxyHolder()
{
    delete _array;
    delete _arrayProxy;
}

af::array*ArrayOrProxyHolder::GetArray()
{
    if (_array) return _array;
    _array = new af::array((af::array)(*_arrayProxy));
    delete _arrayProxy;
    _arrayProxy = nullptr;
    return _array;
}
