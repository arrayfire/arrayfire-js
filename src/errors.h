#ifndef FIRE_ERRORS_H
#define FIRE_ERRORS_H

#include <nan.h>
#include <stdexcept>

inline void NanThrowInvalidNumberOfArgumentsError()
{
    NanThrowError("Invalid number of arguments.");
}

inline void NanThrowCallbackArgumentExpectedError()
{
    NanThrowError("Callback argument expected.");
}

inline void NanThrowInvalidDTypeArgumentError()
{
    NanThrowError("Invalid dtype argument!");;
}

inline std::logic_error GetArgumentIsNotAnObjectException()
{
    return std::logic_error("Argument is not an object.");
}

inline std::logic_error GetArgumentIsNotAComplexException()
{
    return std::logic_error("Argument is not a Complex object instance.");
}

inline std::logic_error GetArgumentIsNotASeqException()
{
    return std::logic_error("Argument is not a Seq object instance.");
}

#endif // FIRE_ERRORS_H

