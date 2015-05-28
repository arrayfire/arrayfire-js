#ifndef ARRAY_FIRE_JS_GUARD_H
#define ARRAY_FIRE_JS_GUARD_H

#include <nan.h>

struct Guard
{
    Guard();
    Guard(const Guard&) = delete;
    Guard(Guard&&) = delete;
    ~Guard();
private:
    static uv_mutex_t lock;
    static bool isInitialized;
    static bool Initialize();
};

#endif // ARRAY_FIRE_JS_GUARD_H
