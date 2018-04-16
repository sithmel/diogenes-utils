Diogenes-utils
==============
For now it contains a decorator to cache services.
```js
const cacheServicePromise = require('diogenes-utils').cacheServicePromise
const cacheTTL = cacheServicePromise({ len: 1, ttl: 1 })
const cachedFunc = cacheTTL((d) => {
  return Promise.resolve(d.a + d.b)
})
```
* len: is the number of items in the cache
* ttl: is the time to live of cached items (in ms)

It is also available a decorator for callback based services:
```js
const cacheServiceCB = require('diogenes-utils').cacheServiceCB
const cacheTTL = cacheServiceCB({ len: 1, ttl: 1 })
```
