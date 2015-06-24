/*
Copyright (c) 2014-2015, ArrayFire
Copyright (c) 2015 Gábor Mező aka unbornchikken (gabor.mezo@outlook.com)
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

* Neither the name of the ArrayFire nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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

