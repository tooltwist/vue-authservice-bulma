/* @flZZow */

/*
 *  Client API for Authservice.io
 *  See https://authservice.io
 */
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)
console.log('(index.js) 1')

import { install } from './install'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import QueryString from 'query-string'
import { assert } from './util/warn'
import { inBrowser } from './util/dom'

// const debug = process.env.NODE_ENV !== 'production'
console.log('(index.js) 2')

const JWT_COOKIE_NAME = 'authservice-jwt'
const LOGIN_TIMEOUT_DAYS = 3

class Authservice {
  // static install: (Vue) => void;
  // static version: string;

  // static install (Vue) {
  //   alert('Install 2...')
  //   // Vue.prototype.$auth = new Authservice()
  //   Vue.prototype.$auth = 123
  //
  //   Object.defineProperty(Vue.prototype, '$authservice', {
  //     get () { return 987 }
  //   })
  // }

  constructor (options) {
    console.log('&&& Authservice constructor', options)
    this.host = options.host ? options.host : 'api.authservice.io'
    this.port = options.port ? options.port : 80
    this.version = options.version ? options.version : 'v2'
    this.apikey = options.apikey
    this.registerResume = options.registerResume
    this.forgetResume = options.forgetResume

    // Current user details
    this.user = null
    this.jwt = null
    this.fromCache = false
  }

  // init (app: any /* Vue component instance */) {
  init (app /* Vue component instance */) {
    console.log('&&& MyComponent init')
    // VVVVV This does not seem to be called
    // alert('za init()')
    process.env.NODE_ENV !== 'production' && assert(
      install.installed,
      `not installed. Make sure to call \`Vue.use(Authservice)\` ` +
      `before creating root instance.`
    )
  }

  endpoint () {
    // console.log('endpoint():', this)
    const protocol = this.protocol ? this.protocol : 'http'
    const endpoint = protocol + '://' + this.host + ':' + this.port + '/' + this.version + '/' + this.apikey
    return endpoint
  }

  //
  //  We've just arrived at a page.
  //  See if a JWT for the current user is provided in the URL parameters
  //  or in a cookie for this site.
  //
  checkInitialLoginStatus (debug) {
    debug = true
    console.log('+++++ checkInitialLoginStatus ++++++')
    // See if we have a AUTHSERVICE_JWT in the URL to this page
    let jwt = this.getURLParameterByName("AUTHSERVICE_JWT")
    if (jwt) {
      if (debug) {
        console.log("***")
        console.log("***")
        console.log("*** AUTHSERVICE_JWT IN URL")
        console.log("***")
        console.log("***")
      }
      const isFromCookie = false
      if (this.setCurrentUserFromJWT(jwt, isFromCookie)) {
      // Remember this JWT in a cookie for the next page.
        this.setCookie(JWT_COOKIE_NAME, jwt, LOGIN_TIMEOUT_DAYS)
        return true
      } else {
        // Invalid JWT
        this.removeCookie(JWT_COOKIE_NAME)
        return false
      }
    }

    // See if we have a cookie containing the current JWT
    jwt = this.getCookie(JWT_COOKIE_NAME)
    if (jwt) {
      if (debug) {
        console.log("***")
        console.log("***")
        console.log("*** AUTHSERVICE_JWT IN A COOKIE")
        console.log("***")
        console.log("***")
      }
      // var isFromCookie = true;
      const isFromCookie = false // Check if it is stale ZZZZ
      if (this.setCurrentUserFromJWT(jwt, isFromCookie)) {
        // Good login from cookie
        return true
      } else {
        // Dud cookie
        this.removeCookie(JWT_COOKIE_NAME)
        return false
      }
    }

    // not a good cookie
    if (debug) {
      console.log("***")
      console.log("***")
      console.log("*** AUTHSERVICE_JWT NOT IN URL OR COOKIE")
      console.log("***")
      console.log("***")
    }
    const isFromCookie = false
    this.setCurrentUserFromJWT(null, isFromCookie)
    return false
  }

  /*
   *  Log in using username / password.
   */
  login (email, password) {
    return new Promise((resolve, reject) => {
      console.log('login(email=' + email + ')')
      // console.log('++++++++++ email=' + email + ', password=' + password)

      /*
       *  Call the server to authenticate the username/password.
       */
      axios({
        method: 'post',
        url: this.endpoint() + '/email/login',
        headers: {
          // 'Authorization': 'Bearer ' + jwt
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          email: email,
          password: password
        }
      })
        .then(response => {
          // JSON responses are automatically parsed.
          // this.posts = response.data
          // console.log('axios reply (response.data)=', response.data)
          // return callback(null, response.data.data[0])
          if (response.data.status === 'ok') {
            // Logged in.
            // console.log('Back from login:', response.data)
            const jwt = response.data.jwt
            const isFromCookie = false
            if (this.setCurrentUserFromJWT(jwt, isFromCookie)) {
              // Good JWT login
              this.setCookie(JWT_COOKIE_NAME, jwt, LOGIN_TIMEOUT_DAYS)
              resolve(this.user.id)
              return
            } else {
              console.log('ok 4')
              // Bad JWT
              this.removeCookie(JWT_COOKIE_NAME)
              console.log('ok 5')
              reject('Invalid credentials')
              return
            }
          } else {
            // We did not sucessfully login
            // -> No current user
            const isFromCache = false
            this.setCurrentUserFromJWT(null, isFromCache)
            this.removeCookie(JWT_COOKIE_NAME)
            reject(response.data.message)
            return
          }
        })
        .catch(e => {
          // We did not sucessfully login
          // => No current user
          const isFromCache = false
          this.setCurrentUserFromJWT(null, isFromCache)
          this.removeCookie(JWT_COOKIE_NAME)
          reject(e.response.data.message)
          return
        })
    })// promise
  }// - login()

  /*
   *  Kick off the OAuth2 login process.
   */
  initiateOAuth (me, authority, relativeResumeURL, relativeFailURL) {
    console.log(`initiateOAuth(me, ${authority})`)

    // See which URL we should use for errors in OAuth2 logins.
    // let errorURL = '/bower_components/pastac-login/test/test-error.html' // VVVVV
    // if (me.error) {
    //   errorURL = me.error
    // }
    // console.log('errorURL=' + errorURL)

    // Decide where we want to end up.
    // If a 'resume' URL has not been provided, we'll come back to this exact
    // same URL, however with any JWT or error parameters removed.
    const l = window.location
    let baseURL = `${l.protocol}//${l.hostname}`
    if (l.port) {
      baseURL += `:${l.port}`
    }
    console.log('\n\nbaseURL=', baseURL)

    // Where to go if the login suceeds?
    var resumeURL
    if (relativeResumeURL) {
      // Use the specified resume URL (which is a relative path)
      resumeURL = baseURL + relativeResumeURL
    } else {
      // Use the current page, but with any JWT or error parameter removed.
      console.log('resume to current page', l)
      const parsed = QueryString.parse(l.search)
      console.log(parsed)

      delete parsed['AUTHSERVICE_JWT']
      delete parsed['AUTHSERVICE_ERROR']
      const params = QueryString.stringify(parsed)
      resumeURL = l.protocol + "//" + l.host + l.pathname
      if (params) {
        resumeURL += '?' + params
      }
      resumeURL += l.hash
      console.log('\n\nresumeURL=', resumeURL)
      console.log(new Buffer(resumeURL).toString('base64'))
    }

    // Get the URL to a "bounce page". This is a page that sets the JWT
    // cookie from a URL parameter, and then redirects to the 'resume' page.
    const resume64 = new Buffer(resumeURL).toString('base64')
    const params = QueryString.stringify({ next: resume64 })
    // let hash = `#/authservice-bounce/${encodeURIComponent(resumeURL)}/true`
    // const hash = `/authservice-bounce`
    const hash = ``
    // const bounceURL = `${l.protocol}//${l.host}/authservice-bounce?${params}#${hash}`
    const bounceURL = `${baseURL}/authservice-bounce?${params}#${hash}`
    console.log('\n\nbounceURL=', bounceURL)
    const successURL = bounceURL

    // Where to go if the login fails?
    var failURL
    if (relativeFailURL) {
      // Use the specified error URL (which is a relative path)
      failURL = baseURL + relativeFailURL
    } else {
      failURL = bounceURL
    }
    console.log('successURL=' + successURL)
    console.log('successURL=' + encodeURIComponent(successURL))
    console.log('failURL=' + failURL)

    let url = `http://${this.host}:${this.port}/${this.version}/oauth2/initiate/${this.apikey}/${authority}`
    url += '?success=' + encodeURIComponent(successURL)
    url += '&fail=' + encodeURIComponent(failURL)
    // alert('Initiate URL:' + url)
    window.location = url
  }// initiateOAuth2

  /*
   *  Log out
   */
  logout () {
    return new Promise((resolve, reject) => {
      // VVVVV Call the server
      var isFromCache = false
      this.setCurrentUserFromJWT(null, isFromCache)
      this.removeCookie(JWT_COOKIE_NAME)
      resolve(0)
      return
    })// new Promise
  }

  register (options) {
    console.log('$authservice.register()', options);
    console.log('ok 0')

    return new Promise((resolve, reject) => {
      // let email = options.email
      // let username = options.username
      // let password = options.password
      // let firstName = options.firstName
      // let middleName = options.middleName
      // let lastName = options.lastName
      // let resume = options.resume
      console.log('ok 0a')

      // Check email and password is valid
      switch (typeof (options.email)) {
        case 'string':
          if (options.email.indexOf('@') < 1) {
            reject('Please enter a valid email address')
          }
          break
        case 'undefined':
          return reject('options.email must be provided')
        default:
          return reject('options.email must be a string')
      }

      // Check we have a URL to go to after email verification.
      switch (typeof (this.registerResume)) {
        case 'string':
          break
        case 'undefined':
          return reject('options.registerResume must be provided')
        default:
          return reject('options.registerResume must be a string')
      }

      var params = {
        email: options.email,
        resume: this.registerResume
      }

      // Maybe check username is valid
      console.log('username is ' + options.username)
      switch (typeof (options.username)) {
        case 'string':
          const username = options.username.trim().toLowerCase()
          if (username.indexOf(' ') >= 0) {
            reject('Username may not contain spaces')
            return
          }
          if (username.indexOf('@') >= 0) {
            reject('Username may not contain @')
            return
          }
          params.username = username
          break
        case 'undefined':
          // alert('using email for username')
          params.username = params.email
          break
        default:
          return reject('If provided, options.username must be a string')
      }
      // if (me.registerRequiresUsername) {
      //   username = username.trim().toLowerCase()
      //   if (username.indexOf(' ') >= 0) {
      //     return failCallback('Username may not contain spaces')
      //   } else if (username.indexOf('@') >= 0) {
      //     return failCallback('Username may not contain @')
      //   }
      //   params.username = username
      // } else {
      //   params.username = email
      // }

      console.log('ok 1')
      // Maybe check password is valid
      switch (typeof (options.password)) {
        case 'string':
          if (options.password.length < 5) {
            return reject('Please enter a longer password')
          }
          params.password = options.password
          break
        case 'undefined':
          break
        default:
          return reject('If provided, options.password must be a string')
      }

      console.log('ok 2')
      // Maybe check first name is valid
      switch (typeof (options.firstName)) {
        case 'string':
          if (options.firstName.length < 1) {
            return reject('Please enter a first name')
          }
          params.firstName = options.firstName
          break
        case 'undefined':
          break
        default:
          return reject('If provided, options.firstName must be a string')
      }

      console.log('ok 3')
      // Maybe check middle name is valid
      switch (typeof (options.middleName)) {
        case 'string':
          if (options.middleName.length < 1) {
            return reject('Please enter a middle name')
          }
          params.middleName = options.middleName
          break
        case 'undefined':
          break
        default:
          return reject('If provided, options.middleName must be a string')
      }

      console.log('ok 4')
      // Maybe check last name is valid
      switch (typeof (options.lastName)) {
        case 'string':
          if (options.lastName.length < 1) {
            return reject('Please enter a last name')
          }
          params.lastName = options.lastName
          break
        case 'undefined':
          break
        default:
          return reject('If provided, options.lastName must be a string')
      }

      // Call the server
      console.log('params=', params)
      axios({
        method: 'put',
        url: this.endpoint() + '/email/register',
        headers: {
          // 'Authorization': 'Bearer ' + jwt
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: params
      })
        .then(response => {
          // JSON responses are automatically parsed.
          console.log('response is ', response)

          if (response.data && response.data.status === 'ok') {
            // If we have a new JWT, re-set the current user
            if (response.jwt) {
              var jwt = response.jwt
              var isFromCookie = false
              if (this.setCurrentUserFromJWT(jwt, isFromCookie)) {
                // Good registration
                this.setCookie(JWT_COOKIE_NAME, jwt, LOGIN_TIMEOUT_DAYS)
              } else {
                // All okay, but no auto-login in from registration
                this.removeCookie(JWT_COOKIE_NAME)
              }
            }
            resolve(jwt)
            return
          } else {
            // Display an error message
            const error = (response.data && response.data.message) ? response.data.message : 'Error while registering'
            reject(error)
            return
          }
        })
        .catch(e => {
          // Error registering
          const error = (e.response.data && e.response.data.Error) ? e.response.data.Error : 'Error while registering'
          reject(error)
          return
        })
    })// new Promise
  }// register()

  forgot (email, options) {
    return new Promise((resolve, reject) => {
      // Check email and password is valid
      if (email === null || email.indexOf('@') < 1) {
        const error = 'Please enter a valid email address'
        reject(error)
        return
      }

      // Decide where we want to end up.
      // If a 'resume' URL has not been provided, we'll come back to this exact
      // same URL, however with any JWT or error parameters removed.
      const l = window.location
      let baseURL = `${l.protocol}//${l.hostname}`
      if (l.port) {
        baseURL += `:${l.port}`
      }
      console.log('\n\nbaseURL=', baseURL)

      // Where to go when they click on the emai link?
      var resumeURL
      if (options && options.forgotResume) {
        // Use the specified resume URL (which is a relative path)
        resumeURL = baseURL + options.forgotResume
      } else {
        // Use the current page, but with any JWT or error parameter removed.
        console.log('resume to current page', l)
        const parsed = QueryString.parse(l.search)
        console.log(parsed)

        delete parsed['AUTHSERVICE_JWT']
        delete parsed['AUTHSERVICE_ERROR']
        const params = QueryString.stringify(parsed)
        resumeURL = l.protocol + "//" + l.host + l.pathname
        if (params) {
          resumeURL += '?' + params
        }
        resumeURL += l.hash
        console.log('\n\nresumeURL=', resumeURL)
        console.log(new Buffer(resumeURL).toString('base64'))
      }

      // Get the URL to a "bounce page". This is a page that sets the JWT
      // cookie from a URL parameter, and then redirects to the 'resume' page.
      const resume64 = new Buffer(resumeURL).toString('base64')
      const params = QueryString.stringify({ next: resume64 })
      const hash = `/authservice-bounce`
      const bounceURL = `${l.protocol}//${l.host}?${params}#${hash}`
      console.log('\n\nbounceURL=', bounceURL)

      // Call the server
      console.log('params=', params)
      axios({
        method: 'post',
        url: this.endpoint() + '/email/forgot',
        headers: {
          // 'Authorization': 'Bearer ' + jwt
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          email: email,
          resume: bounceURL
        }
      })
        .then(response => {
          // JSON responses are automatically parsed.
          if (response.data.status === 'ok') {
            // Email sent successfully
            resolve(response.data)
            return
          } else {
            // Error sending the email
            const error = (response.data && response.data.message) ? response.data.message : 'Error while sending email'
            reject(error)
            return
          }
        })
        .catch(e => {
          // Error sending the email
          const error = (e.response.data && e.response.data.message) ? e.response.data.message : 'Error while sending email'
          reject(error)
          return
        })
    })
  }// - forgot()

  //
  //  Get a URL parameter.
  //
  getURLParameterByName (name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search)
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  }

  // Set the current user from a JWT.
  // Does not change cookies.
  // Returns true on success.
  setCurrentUserFromJWT (jwt, fromCookie) {
    // console.log()
    // console.log('++++++++>  setCurrentUserFromJWT(): jwt=' + jwt)

    let haveUser = false
    let ident = null
    if (jwt) {
      // See https://github.com/auth0/jwt-decode
      try {
        var decoded = jwtDecode(jwt)
        console.log('decoded=', decoded)
        ident = decoded.identity
        haveUser = true
      } catch (e) {
        console.log('Error decoding JWT: ', e)
        // alert('Error decoding invalid JWT')
        haveUser = false
      }
    }

    // Change the current user.
    // let oldCurrentUser = user
    if (haveUser) {
      const user = {
        tenant: ident.tenant,
        authority: ident.authority,
        avatar: ident.avatar,
        email: ident.email,
        entityType: ident.entity_type,
        firstname: ident.first_name,
        fullname: ident.full_name,
        gender: ident.gender,
        id: ident.id,
        isAdmin: ident.is_admin,
        languages: ident.languages,
        lastname: ident.last_name,
        locale: ident.locale,
        location: ident.location,
        mediaPage: ident.media_page,
        middlename: ident.middle_name,
        privileges: ident.privileges,
        status: ident.status,
        timezone: ident.timezone,
        username: ident.username
        // type: ident.type,
      }

      // console.log('Setting user to ', user)
      this.user = user
      this.jwt = jwt
      this.fromCache = fromCookie
      return true
    } else {
      // No longer logged in
      this.user = null
      this.jwt = null
      this.fromCache = false
      return false
    }
  }// setCurrentUserFromJWT

  // See if a username is available
  usernameAvailability (username) {
    // console.log('usernameAvailability()', username)
    return new Promise((resolve, reject) => {
      // Check the length of the username
      username = username.trim().toLowerCase()
      if (username.length < 3) {
        reject('Username must be 3 or more characters')
        return
      }

      // Ask the server if the username is in use
      var url = this.endpoint() + '/username-availability/' + encodeURIComponent(username)
      // console.log('url=', url)
      axios({
        method: 'get',
        url: url,
        headers: {
          // 'Authorization': 'Bearer ' + jwt
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => {
          // JSON responses are automatically parsed.
          if (response.data.status === 'available') {
            // Name is available
            resolve(null)
            return
          } else {
            // Name not available
            resolve(response.data.error)
            return
          }
        })
        .catch(e => {
          // alert('Communications error: unable to determine if this username is available')
          const error = e.response.data.Error ? e.response.data.Error : 'Could not check availability'
          reject(error)
          return
        })
    })// new Promise
  }

  /*
   *  Cookie handling
   */
  setCookie (cname, cvalue, exdays) {
    // console.log('setCookie(' + cname + ', ' + cvalue + ')')
    if (cvalue) {
      console.log('setting cookie (' + cname + ')')
    } else {
      console.log('clearing cookie (' + cname + ')')
    }
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
  }// setCookie()

  getCookie (cname) {
    // console.log('getCookie(' + cname + ')')
    var name = cname + "="
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        // console.log('- found cookie')
        return c.substring(name.length, c.length)
      }
    }
    // console.log('- no cookie with this name')
    return ""
  }// getCookie()

  removeCookie (cname) {
    // console.log('removeCookie(' + cname + ')')
    this.setCookie(cname, null, 0)
  }// removeCookie()
}

Authservice.install = install // The imported install()
Authservice.version = '__VERSION__'
if (inBrowser && window.Vue) {
  window.Vue.use(Authservice)
}

export default Authservice
