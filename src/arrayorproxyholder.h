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

    ArrayOrProxyHolder& operator=(const ArrayOrProxyHolder& h)
    {
        if (_arrayProxy)
        {
            if (h._arrayProxy)
            {
                *_arrayProxy = *h._arrayProxy;
            }
            else
            {
                *_arrayProxy = *h._array;
            }
        }
        else
        {
            if (h._arrayProxy)
            {
                *_array = *h._arrayProxy;
            }
            else
            {
                *_array = *h._array;
            }
        }
        return *this;
    }

    ArrayOrProxyHolder& operator=(int v)
    {
        if (_arrayProxy)
        {
            *_arrayProxy = v;
        }
        else
        {
            *_array = v;
        }
        return *this;
    }

    ArrayOrProxyHolder& operator=(double v)
    {
        if (_arrayProxy)
        {
            *_arrayProxy = v;
        }
        else
        {
            *_array = v;
        }
        return *this;
    }

    ArrayOrProxyHolder& operator=(float v)
    {
        if (_arrayProxy)
        {
            *_arrayProxy = v;
        }
        else
        {
            *_array = v;
        }
        return *this;
    }

    ArrayOrProxyHolder& operator=(const af::af_cdouble& v)
    {
        if (_arrayProxy)
        {
            *_arrayProxy = v;
        }
        else
        {
            *_array = v;
        }
        return *this;
    }

    ArrayOrProxyHolder& operator=(const af::af_cfloat& v)
    {
        if (_arrayProxy)
        {
            *_arrayProxy = v;
        }
        else
        {
            *_array = v;
        }
        return *this;
    }

    ArrayOrProxyHolder& operator=(__int64_t v)
    {
        if (_arrayProxy)
        {
            *_arrayProxy = v;
        }
        else
        {
            *_array = v;
        }
        return *this;
    }

private:
    af::array* _array;
    af::array::array_proxy* _arrayProxy;
};

#endif // ARRAYORPROXYHOLDER_H
