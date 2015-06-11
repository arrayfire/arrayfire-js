#ifndef FIRE_JS_ARRAYORPROXYHOLDER_H
#define FIRE_JS_ARRAYORPROXYHOLDER_H

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

    ArrayOrProxyHolder& operator=(ArrayOrProxyHolder&& h);

    bool NeedsDouble() const;

    dim_t elements() const
    {
        if (_arrayProxy) return _arrayProxy->elements();
        return _array->elements();
    }

    af::dtype type() const
    {
        if (_arrayProxy) return _arrayProxy->type();
        return _array->type();
    }

    af::dim4 dims() const
    {
        if (_arrayProxy) return _arrayProxy->dims();
        return _array->dims();
    }

    dim_t dims(unsigned dim) const
    {
        if (_arrayProxy) return _arrayProxy->dims(dim);
        return _array->dims(dim);
    }

    unsigned numdims() const
    {
        if (_arrayProxy) return _arrayProxy->numdims();
        return _array->numdims();
    }

    size_t bytes() const
    {
        if (_arrayProxy) return _arrayProxy->bytes();
        return _array->bytes();
    }

    af::array copy() const
    {
        if (_arrayProxy) return _arrayProxy->copy();
        return _array->copy();
    }

    bool isempty() const
    {
        if (_arrayProxy) return _arrayProxy->isempty();
        return _array->isempty();
    }

    bool isscalar() const
    {
        if (_arrayProxy) return _arrayProxy->isscalar();
        return _array->isscalar();
    }

    bool isvector() const
    {
        if (_arrayProxy) return _arrayProxy->isvector();
        return _array->isvector();
    }

    bool isrow() const
    {
        if (_arrayProxy) return _arrayProxy->isrow();
        return _array->isrow();
    }

    bool iscolumn() const
    {
        if (_arrayProxy) return _arrayProxy->iscolumn();
        return _array->iscolumn();
    }

    bool iscomplex() const
    {
        if (_arrayProxy) return _arrayProxy->iscomplex();
        return _array->iscomplex();
    }

    bool isreal() const
    {
        if (_arrayProxy) return _arrayProxy->isreal();
        return _array->isreal();
    }

    bool isdouble() const
    {
        if (_arrayProxy) return _arrayProxy->isdouble();
        return _array->isdouble();
    }

    bool issingle() const
    {
        if (_arrayProxy) return _arrayProxy->issingle();
        return _array->issingle();
    }

    bool isrealfloating() const
    {
        if (_arrayProxy) return _arrayProxy->isrealfloating();
        return _array->isrealfloating();
    }

    bool isfloating() const
    {
        if (_arrayProxy) return _arrayProxy->isfloating();
        return _array->isfloating();
    }

    bool isinteger() const
    {
        if (_arrayProxy) return _arrayProxy->isinteger();
        return _array->isinteger();
    }

    bool isbool() const
    {
        if (_arrayProxy) return _arrayProxy->isbool();
        return _array->isbool();
    }

    void eval() const
    {
        if (_arrayProxy) return _arrayProxy->eval();
        return _array->eval();
    }

    af::array as(af::dtype type) const
    {
        if (_arrayProxy) return _arrayProxy->as(type);
        return _array->as(type);
    }

    af::array::array_proxy row(int index)
    {
        if (_arrayProxy) return _arrayProxy->row(index);
        return _array->row(index);
    }

    const af::array::array_proxy row(int index) const
    {
        if (_arrayProxy) return _arrayProxy->row(index);
        return _array->row(index);
    }

    af::array::array_proxy rows(int first, int last)
    {
        if (_arrayProxy) return _arrayProxy->rows(first, last);
        return _array->rows(first, last);
    }

    const af::array::array_proxy rows(int first, int last) const
    {
        if (_arrayProxy) return _arrayProxy->rows(first, last);
        return _array->rows(first, last);
    }

    af::array::array_proxy col(int index)
    {
        if (_arrayProxy) return _arrayProxy->col(index);
        return _array->col(index);
    }

    const af::array::array_proxy col(int index) const
    {
        if (_arrayProxy) return _arrayProxy->col(index);
        return _array->col(index);
    }

    af::array::array_proxy cols(int first, int last)
    {
        if (_arrayProxy) return _arrayProxy->cols(first, last);
        return _array->cols(first, last);
    }

    const af::array::array_proxy cols(int first, int last) const
    {
        if (_arrayProxy) return _arrayProxy->cols(first, last);
        return _array->cols(first, last);
    }

    af::array::array_proxy slice(int index)
    {
        if (_arrayProxy) return _arrayProxy->slice(index);
        return _array->slice(index);
    }

    const af::array::array_proxy slice(int index) const
    {
        if (_arrayProxy) return _arrayProxy->row(index);
        return _array->row(index);
    }

    af::array::array_proxy slices(int first, int last)
    {
        if (_arrayProxy) return _arrayProxy->slices(first, last);
        return _array->slices(first, last);
    }

    const af::array::array_proxy slices(int first, int last) const
    {
        if (_arrayProxy) return _arrayProxy->slices(first, last);
        return _array->slices(first, last);
    }

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

    OP_ASSIGN2(=,  __int64)
    OP_ASSIGN2(+=, __int64)
    OP_ASSIGN2(-=, __int64)
    OP_ASSIGN2(*=, __int64)
    OP_ASSIGN2(/=, __int64)

#undef OP_ASSIGN
#undef OP_ASSIGN2

private:
    af::array* _array;
    af::array::array_proxy* _arrayProxy;
};

#endif // FIRE_JS_ARRAYORPROXYHOLDER_H
