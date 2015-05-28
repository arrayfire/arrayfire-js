#ifndef ARRAY_FIRE_JS_HELPERS_H
#define ARRAY_FIRE_JS_HELPERS_H

#include <utility>
#include <arrayfire.h>

std::pair<af::dtype, unsigned> ConvDtype(unsigned udtype);

char* ErrToString(af_err);

#endif // ARRAY_FIRE_JS_HELPERS_H

