const objUUID = require('obj-uuid')
const memoizeDecoratorCB = require('async-deco/callback/memoize')
const memoizeDecoratorPromise = require('async-deco/promise/memoize')

function getKey (deps) {
  return objUUID.getIdFromAttributes(deps)
}

function cacheServiceCB ({ len, ttl }) {
  return memoizeDecoratorCB({ ttl, len, getKey })
}

function cacheServicePromise ({ len, ttl }) {
  return memoizeDecoratorPromise({ ttl, len, getKey })
}

module.exports = {
  cacheServiceCB, cacheServicePromise
}
