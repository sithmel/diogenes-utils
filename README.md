Diogenes-utils
==============

cacheService
------------
A decorator to cache services.
The decorator works for function returning synchronously or returning a promise.
The cache is based on the service dependencies: if they don't change the result is not cached.
If the decorated function throws an exception or returns a rejected promise, this is not cached.

The decorator uses a LRU cache algorithm to decide whether to get rid of a cached value.
It also supports a time-to-live for cached values. But you have to consider stale cache entries are not removed until the size of the cache exceeds the length. This allows to keep the running time of the algorithm constant (O(1)) for any operation.
```js
const cacheService = require('diogenes-utils').cacheService
const cacheTTL = cacheService({ len: 1, ttl: 1 })
const cachedFunc = cacheTTL((d) => {
  return Promise.resolve(d.a + d.b)
})
```
* len: is the number of items in the cache
* ttl: is the time to live of cached items (in ms)
