#include "ext.h"
#include "helpers.h"

using namespace std;
using namespace v8;
using namespace node;

pair<af::dtype, unsigned> convDtype(unsigned udtype)
{
    unsigned sizeOf;
    af::dtype dtype;
    switch (udtype)
    {
        case 0:
            dtype = f32;
            sizeOf = 32 / 8;
        break;
        case 1:
            dtype = c32;
            sizeOf = 32 / 8;
        break;
        case 2:
            dtype = f64;
            sizeOf = 64 / 8;
        break;
        case 3:
            dtype = c64;
            sizeOf = 64 / 8;
        break;
        case 4:
            dtype = b8;
            sizeOf = 8 / 8;
        break;
        case 5:
            dtype = s32;
            sizeOf = 32 / 8;
        break;
        case 6:
            dtype = u32;
            sizeOf = 32 / 8;
        break;
        case 7:
            dtype = u8;
            sizeOf = 8 / 8;
        break;
        case 8:
            dtype = s64;
            sizeOf = 64 / 8;
        break;
        case 9:
            dtype = u64;
            sizeOf = 64 / 8;
        break;
        default:
            throw exception("DType is out of range.");
    }
    return move(make_pair(dtype, sizeOf));
}
