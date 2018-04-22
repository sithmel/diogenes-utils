Diogenes-utils
==============
For now it contains a decorator to cache services.
```js
const cacheService = require('diogenes-utils').cacheService
const cacheTTL = cacheService({ len: 1, ttl: 1 })
const cachedFunc = cacheTTL((d) => {
  return Promise.resolve(d.a + d.b)
})
```
* len: is the number of items in the cache
* ttl: is the time to live of cached items (in ms)

The decorator works for function returning synchronously or returning a promise.
