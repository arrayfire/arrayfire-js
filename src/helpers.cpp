#include "ext.h"
#include "helpers.h"

using namespace std;
using namespace v8;
using namespace node;

pair<af::dtype, unsigned> ConvDtype(unsigned udtype)
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
            throw logic_error("DType is out of range.");
    }
    return move(make_pair(dtype, sizeOf));
}

string ErrToString(af_err err)
{
    switch (err)
    {
        case AF_ERR_INTERNAL :
            return "Internal error (AF_ERR_INTERNAL).";
            break;
        case AF_ERR_NOMEM :
            return "Not enough memory error (AF_ERR_NOMEM).";
            break;
        case AF_ERR_DRIVER :
            return "Driver error (AF_ERR_DRIVER).";
            break;
        case AF_ERR_RUNTIME :
            return "Runtime error (AF_ERR_RUNTIME).";
            break;
        case AF_ERR_INVALID_ARRAY :
            return "Invalid array error (AF_ERR_INVALID_ARRAY).";
            break;
        case AF_ERR_ARG :
            return "Argument error (AF_ERR_ARG).";
            break;
        case AF_ERR_SIZE :
            return "Size error (AF_ERR_SIZE).";
            break;
        case AF_ERR_DIFF_TYPE :
            return "Diff type error (AF_ERR_DIFF_TYPE).";
            break;
        case AF_ERR_NOT_SUPPORTED :
            return "Operation is not supported (AF_ERR_NOT_SUPPORTED).";
            break;
        case AF_ERR_NOT_CONFIGURED :
            return "Not configured error (AF_ERR_NOT_CONFIGURED).";
            break;
        case AF_ERR_INVALID_TYPE :
            return "Invalid type error (AF_ERR_INVALID_TYPE).";
            break;
        case AF_ERR_INVALID_ARG :
            return "Invalid argument error (AF_ERR_INVALID_ARG).";
            break;
        default:
            return "Uknown ArrayFire error (AF_ERR_UNKNOWN).";
    };
}
