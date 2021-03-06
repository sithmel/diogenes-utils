const objUUID = require('obj-uuid')
const LRUCache = require('little-ds-toolkit/lib/lru-cache')

function getKey (deps) {
  return objUUID.getIdFromAttributes(deps)
}

function cacheService ({ len, ttl }) {
  return function _cacheService (func) {
    const cache = new LRUCache({ maxLen: len, defaultTTL: ttl })
    return function cachedService (deps) {
      const key = getKey(deps)
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = func.call(this, deps)
      if (typeof result === 'object' && 'then' in result) {
        return result
          .then((res) => {
            cache.set(key, result)
            return Promise.resolve(res)
          })
      } else {
        cache.set(key, result)
        return result
      }
    }
  }
}

module.exports = cacheService
