/*
Copyright 2015 Gábor Mező aka unbornchikken

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

#ifndef FIRE_ERRORS_H
#define FIRE_ERRORS_H

#include <nan.h>
#include <stdexcept>
#include <sstream>

struct fire_error : public std::runtime_error
{
    fire_error(const char* what): runtime_error(what) {}
};

inline void _NanThrow(const char* what, const char* file, int line)
{
    using namespace std;
    stringstream s;
    s << what << " in '" << file << "' at " << line << ".";
    NanThrowError(s.str().c_str());
}

#define NAN_THROW(what) _NanThrow(what, __FILE__, __LINE__)

#define NAN_THROW_INVALID_ARGS() NAN_THROW("Invalid arguments.")
#define NAN_THROW_INVALID_NO_OF_ARGS() NAN_THROW("Invalid number of arguments.")
#define NAN_THROW_CB_EXPECTED() NAN_THROW("Callback argument expected.")
#define NAN_THROW_INVALID_DTYPE() NAN_THROW("Invalid dtype argument!")

#define FIRE_THROW(what) \
{\
    std::stringstream s;\
    s << what << " in '" << __FILE__ << "' at " << __LINE__ << ".";\
    throw fire_error(s.str().c_str());\
}

#define FIRE_THROW_ARG_IS_NOT_AN_OBJ() FIRE_THROW("Argument is not an object.");
#define FIRE_THROW_ARG_IS_NOT_A_DIM4() FIRE_THROW("Argument is not a Dim4 object.");
#define FIRE_THROW_ARG_IS_NOT_A_CPLX() FIRE_THROW("Argument is not a Complex object.");
#define FIRE_THROW_ARG_IS_NOT_A_SEQ() FIRE_THROW("Argument is not a Seq object.");
#define FIRE_THROW_ARG_IS_NOT_AN_INDEX() FIRE_THROW("Argument is not an Index.");
#define FIRE_THROW_CB_EXPECTED() FIRE_THROW("Callback argument expected.");

#define FIRE_CATCH \
    catch(fire_error &ex) { return NanThrowError(ex.what()); } \
    catch(af::exception &ex) { return NAN_THROW(ex.what()); } \
    catch(std::exception &ex) { return NAN_THROW(ex.what()); } \
    catch(...) { return NAN_THROW("Unknown error!"); }

#endif // FIRE_ERRORS_H

