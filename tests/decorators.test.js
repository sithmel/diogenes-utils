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

  it('caches once', async () => {
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

  it('does not cache rejections', async () => {
    let executions = 0
    const cachedFunc = cacheOnce((d) => {
      executions++
      return Promise.reject(new Error('nope'))
    })
    let res1, res2, res3
    try {
      res1 = await cachedFunc({ a: 1, b: 2 })
    } catch (e) {}
    try {
      res2 = await cachedFunc({ a: 1, b: 2 })
    } catch (e) {}
    try {
      res3 = await cachedFunc({ a: 2, b: 2 })
    } catch (e) {}

    assert.isUndefined(res1)
    assert.isUndefined(res2)
    assert.isUndefined(res3)
    assert.equal(executions, 3)
  })

  it('caches sync functions', async () => {
    let executions = 0
    const cachedFunc = cacheOnce((d) => {
      executions++
      return d.a + d.b
    })
    const res1 = cachedFunc({ a: 1, b: 2 })
    const res2 = cachedFunc({ a: 1, b: 2 })
    const res3 = cachedFunc({ a: 2, b: 2 })

    assert.equal(res1, 3)
    assert.equal(res2, 3)
    assert.equal(res3, 4)
    assert.equal(executions, 2)
  })

  it('does not cache when throwing exceptions', async () => {
    let executions = 0
    const cachedFunc = cacheOnce((d) => {
      executions++
      throw new Error('error')
    })
    let res1, res2, res3
    try {
      res1 = cachedFunc({ a: 1, b: 2 })
    } catch (e) {}
    try {
      res2 = cachedFunc({ a: 1, b: 2 })
    } catch (e) {}
    try {
      res3 = cachedFunc({ a: 2, b: 2 })
    } catch (e) {}

    assert.isUndefined(res1)
    assert.isUndefined(res2)
    assert.isUndefined(res3)
    assert.equal(executions, 3)
  })

  it('caches twice', async () => {
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

  it('caches with TTL', async () => {
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
