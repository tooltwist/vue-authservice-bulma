/*
 *  This code is modelled on vue-router/src/install.js
 *  The net effect is that when you call
 *
 *    new Vue({
 *      ...
 *      authservice: ...
 *    }
 *
 *  then the value of authservice will be available as
 *  this.$authservice in this and all subsequent Vue objects
 *  and components.
 */
import AuthserviceNavbar from './components/AuthserviceNavbar.vue'
import AuthserviceNavbarBlu from './components/AuthserviceNavbarBlu.vue'
import AuthserviceBulma from './components/AuthserviceBulma.vue'
import MyComponent from './components/my-component.vue'
import AuthserviceFirstname from './components/authservice-firstname.vue'
import AuthserviceFullName from './components/authservice-fullname.vue'

export let _Vue

console.log('HIIIWUWUU 81 (install.js)')


export function install (Vue) {
  console.log('&&& authservice-vue install')

  if (install.installed) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  // Vue.mixin adds an additional 'beforeCreate' function to it's
  // list of functions to be called when new Vue is created. We'll
  // use it to look for new Vue({ authservice }). If found, we'll
  // consider this to be the root. If it is not found, then we will
  // assume this is a child of the root, and create pointers back
  // to the root.
  Vue.mixin({
    beforeCreate () {
      // console.log('install.js - beforeCreate()')
      // this.$options is the options passed to new Vue({ })
      if (isDef(this.$options.authservice)) {
        console.log('Initialise the root')
        // This must be the root, since we found authservice in it's options.
        this._authserviceRoot = this
        this._authservice = this.$options.authservice
        // this._authservice.init(this)
        Vue.util.defineReactive(this, '_authservice', this.$authservice)
        // Vue.util.defineReactive(this, '_authservice', this._authservice.jwt)
        // Vue.util.defineReactive(this, '_authservice', this._authservice.fromCache)

        console.log('Checking login status from beforeCreate()')
        this._authservice.checkInitialLoginStatus(false)
      } else {
        this._authserviceRoot = (this.$parent && this.$parent._authserviceRoot) || this
      }
      // registerInstance(this, this)
    },
    destroyed () {
      // registerInstance(this)
    }
  })

  // As described above, the Vue instances form a hierachy. The mixin
  // above ensures that each instance has an '_authserviceRoot' field
  // that points to the instance where 'authservice' was passed to new Vue({  }).
  // Note that it's _authserviceRoot might actually point to itself.
  Object.defineProperty(Vue.prototype, '$authservice', {
    get () { return this._authserviceRoot._authservice }
  })

  // Define the components
  Vue.component('authservice-navbar', AuthserviceNavbar)
  Vue.component('authservice-navbar-blu', AuthserviceNavbarBlu)
  Vue.component('authservice-bulma', AuthserviceBulma)
  Vue.component('my-component', MyComponent)
  Vue.component('authservice-firstname', AuthserviceFirstname)
  Vue.component('authservice-fullname', AuthserviceFullName)
}
