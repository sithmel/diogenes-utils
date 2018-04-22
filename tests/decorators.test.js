/* eslint-env node, mocha */
const cacheService = require('..').cacheService
const assert = require('chai').assert

function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

describe('cacheService', () => {
  let cacheOnce
  let cacheTwice
  let cacheTTL

  beforeEach(() => {
    cacheOnce = cacheService({ len: 1 })
    cacheTwice = cacheService({ len: 2 })
    cacheTTL = cacheService({ len: 1, ttl: 1 })
  })

  it('it caches once', async () => {
    let executions = 0
    const cachedFunc = cacheOnce((d) => {
      executions++
      return Promise.resolve(d.a + d.b)
    })
    const res1 = await cachedFunc({ a: 1, b: 2 })
    const res2 = await cachedFunc({ a: 1, b: 2 })
    const res3 = await cachedFunc({ a: 2, b: 2 })

    assert.equal(res1, 3)
    assert.equal(res2, 3)
    assert.equal(res3, 4)
    assert.equal(executions, 2)
  })

  it('it caches twice', async () => {
    let executions = 0
    const cachedFunc = cacheTwice((d) => {
      executions++
      return Promise.resolve(d.a + d.b)
    })
    const res1 = await cachedFunc({ a: 1, b: 2 })
    const res3 = await cachedFunc({ a: 2, b: 2 })
    const res2 = await cachedFunc({ a: 1, b: 2 })
    const res4 = await cachedFunc({ a: 2, b: 2 })

    assert.equal(res1, 3)
    assert.equal(res2, 3)
    assert.equal(res3, 4)
    assert.equal(res4, 4)
    assert.equal(executions, 2)
  })

  it('it caches with TTL', async () => {
    let executions = 0
    const cachedFunc = cacheTTL((d) => {
      executions++
      return Promise.resolve(d.a + d.b)
    })
    const res1 = await cachedFunc({ a: 1, b: 2 })
    const res2 = await cachedFunc({ a: 1, b: 2 })
    await delay(5)
    const res3 = await cachedFunc({ a: 1, b: 2 })

    assert.equal(res1, 3)
    assert.equal(res2, 3)
    assert.equal(res3, 3)
    assert.equal(executions, 2)
  })
})
