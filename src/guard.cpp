#include "ext.h"
#include "guard.h"

uv_mutex_t Guard::lock;

bool Guard::isInitialized(Guard::Initialize());

Guard::Guard()
{
    uv_mutex_lock(&Guard::lock);
}

Guard::~Guard()
{
    uv_mutex_unlock(&Guard::lock);
}

bool Guard::Initialize()
{
    uv_mutex_init(&Guard::lock);
    return true;
}

