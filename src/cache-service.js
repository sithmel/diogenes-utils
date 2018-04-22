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
      cache.set(key, result)
      return result
    }
  }
}

module.exports = cacheService
