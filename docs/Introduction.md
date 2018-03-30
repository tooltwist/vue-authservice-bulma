>  A Vue.js component module, providing Authentication functionality.

## Introduction

Authservice-vue is normally installed globally within the Vue.js application,
for example from main.js.

```js static
import Authservice from 'authservice-vue'

...

Vue.use(Authservice)
const authservice = new Authservice({
  host: 'localhost', (defaults to api.authservice.io)
  port: 9090,
  version: 'v2',
  apikey: 'training' (obtained from the Tooltwist website)
})

...

new Vue({
  ...
  authservice // inject authservice to all children
})

```

From this point the `authservice-vue` components can be used anywhere in the application.

In addition, a `this.$authservice` object provides direct access to the
authservice API.
