#ifndef FIRE_ERRORS_H
#define FIRE_ERRORS_H

#include <nan.h>
#include <stdexcept>

inline void NanThrowInvalidNumberOfArgumentsError()
{
    return NanThrowError("Invalid number of arguments.");
}

inline void NanThrowCallbackArgumentExpected()
{
    return NanThrowError("Callback argument expected.");
}

inline std::logic_error GetArgumentIsNotAnObjectException()
{
    return std::logic_error("Argument is not an object.");
}

inline std::logic_error GetArgumentIsNotAComplexException()
{
    return std::logic_error("Argument is not a Complex object instance.");
}

#endif // FIRE_ERRORS_H

