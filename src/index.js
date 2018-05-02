const glob = require('glob')
const path = require('path')

function getFileName () {
  try {
    const orig = Error.prepareStackTrace
    Error.prepareStackTrace = function (_, stack) {
      return stack
    }
    const err = new Error()
    const stack = err.stack
    Error.prepareStackTrace = orig
    const stackItem = stack[2]
    return stackItem.getFileName()
  } catch (e) {
    return undefined
  }
}

function getGlobFromPattern (pattern, dirname) {
  let globPattern
  if (pattern[0] === '.') {
    globPattern = path.join(dirname, pattern)
  } else if (path.isAbsolute(pattern)) {
    globPattern = pattern
  } else {
    const fragments = pattern.split('/')
    const firstFragment = fragments[0]
    const basefile = require.resolve(firstFragment)
    const nodeDirname = path.dirname(basefile)
    fragments[0] = nodeDirname
    globPattern = path.join(...fragments)
  }
  return glob.sync(globPattern)
}

function requireMany (patterns, dirname) {
  dirname = dirname || path.dirname(getFileName())
  patterns = Array.isArray(patterns) ? patterns : [patterns]

  return patterns
    .map((pattern) =>
      getGlobFromPattern(pattern, dirname))
    .reduce((acc, arr) => acc.concat(arr), [])
    .map(require)
}

module.exports = requireMany
