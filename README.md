require-many
============

Import an array of node modules, using globbing and require.resolve.
```js
const loadRegistry = require('diogenes-utils').loadRegistry
// or const cacheService = require('diogenes-utils/src/load-registry')
const registry = Diogenes.getRegistry()
loadRegistry(registry, 'services/*.js')
```
