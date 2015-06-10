#ifndef ARRAYORPROXYHOLDER_H
#define ARRAYORPROXYHOLDER_H

#include <arrayfire.h>

struct ArrayOrProxyHolder
{
    ArrayOrProxyHolder() = delete;
    ArrayOrProxyHolder(const ArrayOrProxyHolder&) = delete;
    ArrayOrProxyHolder(ArrayOrProxyHolder&&);
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

    ArrayOrProxyHolder &&operator=(ArrayOrProxyHolder&& h);

#define OP_ASSIGN(OP)\
    ArrayOrProxyHolder& operator OP(const ArrayOrProxyHolder& h)\
    {\
        if (_arrayProxy)\
        {\
            if (h._arrayProxy)\
            {\
                *_arrayProxy OP *h._arrayProxy;\
            }\
            else\
            {\
                *_arrayProxy OP *h._array;\
            }\
        }\
        else\
        {\
            if (h._arrayProxy)\
            {\
                *_array OP *h._arrayProxy;\
            }\
            else\
            {\
                *_array OP *h._array;\
            }\
        }\
        return *this;\
    }\

#define OP_ASSIGN2(OP, TYPE)\
    ArrayOrProxyHolder& operator OP(TYPE v)\
    {\
        if (_arrayProxy)\
        {\
            *_arrayProxy = v;\
        }\
        else\
        {\
            *_array = v;\
        }\
        return *this;\
    }

    OP_ASSIGN(=)
    OP_ASSIGN(+=)
    OP_ASSIGN(-=)
    OP_ASSIGN(*=)
    OP_ASSIGN(/=)

    OP_ASSIGN2(=,  int)
    OP_ASSIGN2(+=, int)
    OP_ASSIGN2(-=, int)
    OP_ASSIGN2(*=, int)
    OP_ASSIGN2(/=, int)

    OP_ASSIGN2(=,  float)
    OP_ASSIGN2(+=, float)
    OP_ASSIGN2(-=, float)
    OP_ASSIGN2(*=, float)
    OP_ASSIGN2(/=, float)

    OP_ASSIGN2(=,  double)
    OP_ASSIGN2(+=, double)
    OP_ASSIGN2(-=, double)
    OP_ASSIGN2(*=, double)
    OP_ASSIGN2(/=, double)

    OP_ASSIGN2(=,  af::af_cdouble)
    OP_ASSIGN2(+=, af::af_cdouble)
    OP_ASSIGN2(-=, af::af_cdouble)
    OP_ASSIGN2(*=, af::af_cdouble)
    OP_ASSIGN2(/=, af::af_cdouble)

    OP_ASSIGN2(=,  af::af_cfloat)
    OP_ASSIGN2(+=, af::af_cfloat)
    OP_ASSIGN2(-=, af::af_cfloat)
    OP_ASSIGN2(*=, af::af_cfloat)
    OP_ASSIGN2(/=, af::af_cfloat)

    OP_ASSIGN2(=,  __int64_t)
    OP_ASSIGN2(+=, __int64_t)
    OP_ASSIGN2(-=, __int64_t)
    OP_ASSIGN2(*=, __int64_t)
    OP_ASSIGN2(/=, __int64_t)

#undef OP_ASSIGN
#undef OP_ASSIGN2

private:
    af::array* _array;
    af::array::array_proxy* _arrayProxy;
};

#endif // ARRAYORPROXYHOLDER_H
