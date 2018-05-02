/* eslint-env node, mocha */
const path = require('path')
const assert = require('chai').assert
const requireMany = require('../src')

describe('requireMany', () => {
  it('load', () => {
    const modules = requireMany('./services/*.js')
    assert.equal(modules[0], 'test1')
    assert.equal(modules[1], 'test2')
  })

  it('load with explicit dirname', () => {
    const modules = requireMany('./services/*.js', __dirname)
    assert.equal(modules[0], 'test1')
    assert.equal(modules[1], 'test2')
  })

  it('load from node module', () => {
    const modules = requireMany('chai/lib/chai/interface/*.js', __dirname)
    assert.equal(modules.length, 3)
    assert.typeOf(modules[0], 'function')
    assert.typeOf(modules[1], 'function')
    assert.typeOf(modules[2], 'function')
  })

  it('load with absolute path', () => {
    const modules = requireMany(path.join(__dirname, 'services/*.js'))
    assert.equal(modules[0], 'test1')
    assert.equal(modules[1], 'test2')
  })
})
