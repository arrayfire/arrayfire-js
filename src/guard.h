#ifndef GUARD_H
#define GUARD_H

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
    static bool initialize();
};

#endif // GUARD_H
