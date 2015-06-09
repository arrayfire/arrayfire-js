#ifndef ARRAYORPROXYHOLDER_H
#define ARRAYORPROXYHOLDER_H

#include <arrayfire.h>

struct ArrayOrProxyHolder
{
    ArrayOrProxyHolder(af::array* array);
    ArrayOrProxyHolder(const af::array& array);
    ArrayOrProxyHolder(af::array::array_proxy* arrayProxy);
    ArrayOrProxyHolder(const af::array::array_proxy& arrayProxy);
    ~ArrayOrProxyHolder();

    af::array* GetArray();
    inline af::array::array_proxy* GetArrayProxy()
    {
        return _arrayProxy;
    }

private:
    af::array* _array;
    af::array::array_proxy* _arrayProxy;
};

#endif // ARRAYORPROXYHOLDER_H
