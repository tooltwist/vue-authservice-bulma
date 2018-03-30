// Documentation for this component is automatically documented using vue-styleguidist.
// See https://github.com/vue-styleguidist/vue-styleguidist/tree/master/docs

//
//  This component uses vue-blu
//  (See https://chenz24.github.io/vue-blu/#/en)
//

<template lang="pug">

  .navbar-item.has-dropdown.is-hoverable
    a.navbar-link(href='') {{( $authservice.user!=null) ? (headerName) : (signin ? 'Sign in' : 'Login') }}
    .navbar-dropdown.is-right.is-boxed


      //
      // Login mode
      //
      div(v-if="mode === 'login'")
        .navbar-item
          form

            .label Username / Email
            p.control
              input.input(type="text" placeholder="Text input" v-model.trim="email" v-on:keydown.native="keyhandler")

            .label Password
            p.control
              input.input(v-model.trim="password" type="password" v-on:keydown.native="keyhandler" autocomplete="current-password")

            // Error message
            alert(v-if="loginError" type="danger")
              | {{loginError}}
            .button.is-primary(v-on:click="doLogin") Login

        // Register and Forgotten password
        .navbar-divider
        a.navbar-item(:size="'sm'" v-on:click="setMode('forgot')" v-on:keydown.native="keyhandler") Forgot password
        a.navbar-item(:size="'sm'" v-on:click="setMode('register')" v-on:keydown.native="keyhandler") Register

        // OAuth2 logins
        .navbar-divider
        .navbar-item
          .button.is-primary(v-on:click="facebookLogin()") Login with Facebook
        .navbar-item
          .button.is-dark(v-on:click="githubLogin()") Login with Github
        .navbar-item
          .button.is-danger(v-on:click="googleLogin()") Login with Google
        .navbar-item
          .button.is-dark(v-on:click="linkedInLogin()") Login with LinkedIn
        .navbar-item
          .button.is-dark(v-on:click="twitterLogin()") Login with Twitter
      //- mode === 'login'

      //
      //  Logged in mode
      //
      div(v-if="mode === 'loggedIn'")
        //.navbar-item
        //  img(v-if="$authservice.user.avatar" :src="$authservice.user.avatar", alt="")
        router-link.navbar-item(to='/applications') Settings
        //- span(v-if="!user.avatar").fa-stack.fa
        //-   i.fa.fa-circle.fa-stack-2x
        //-   i.fa.fa-user.fa-stack-1x.fa-inverse
        //-   | &nbsp;{{user.firstname}}
        // VVVV User defined menu options
        a.navbar-item.is-white(v-on:click="doSignout()") {{signin ? 'Sign out' : 'Logout'}}
        // | {{$authservice.user}}
      //- mode === 'loggedIn'

      //
      // Forgot mode
      //
      div(v-if="mode === 'forgot'")
        .navbar-item
          form
            // h4 Forgotten password
            .label Forgotten password
            .forgot-text
              | Forgot your password? No problem. Enter your email address below and we'll
              | well send an email with a link to reset your password.

            // Email address field
            .label Email Address
            p.control
              input.input(v-model.trim="forgotEmail" type="text" v-on:keydown.native="keyhandler")

            // Error message
            alert(v-if="forgotError" type="danger")
              | {{forgotError}}

        // Forgotten password submit button
        .navbar-divider
        .navbar-item
          .button.is-primary.small.is-right(v-on:click="forgot()" v-on:keydown.native="keyhandler") Send Email
          | &nbsp;&nbsp;
          .button.is-white.small.is-right(v-on:click="setMode('login')" v-on:keydown.native="keyhandler") Cancel
      //- mode === 'forgot'

      //
      // Message for after the forgot email has been sent
      //
      div(v-if="mode === 'forgotAfter'")
        .navbar-item
          form
            .forgot-text
              | We have sent an email to {{forgotEmail}} with
              | instructions to reset your password.
        .navbar-divider
        // Should just close the dropdown VVVVV
        .button.is-primary.small(v-on:click="setMode('login')") Ok
      //- mode === 'forgotAfter'

      //
      // Register a new user
      //
      div(v-if="mode === 'register'")
        .navbar-item
          form
            .register-text
              | Hi!
              | Enter your details and we'll be happy to sign you up.

            // Username
            div(v-if="registerRequiresUsername")
              .label Username
              p.control
                input.input(v-model.trim="registerUsername" type="text" v-on:keydown.native="keyhandler" v-on:input="validateUsername" placeholder="Choose a user name")

            //b-form-group(v-if="registerRequiresUsername" label="Username" placeholder="Choose a user name")
            //  b-form-input(v-model.trim="registerUsername" type="text" v-on:keydown.native="keyhandler" v-on:input="validateUsername" :state="registerUsernameState" autocomplete="off")
            //  b-form-feedback#input-feedback
            //    // This will only be shown if the preceeding input has an invalid state
            //    | {{registerUsernameError}}

            // Email
            .label Email
            p.control
              input.input(v-model.trim="registerEmail" type="text" v-on:keydown.native="keyhandler")
            div(v-if="registerRequiresPassword")
            .label Password
            p.control
              input.input(v-model.trim="registerPassword" type="password" v-on:keydown.native="keyhandler" autocomplete="off")

            div(v-if="registerRequiresFirstName")
              .label First name
              p.control
                input.input(v-model.trim="registerFirstName" v-on:keydown.native="keyhandler")
            div(v-if="registerRequiresMiddleName")
              .label Middle name
              p.control
                input.input(v-model.trim="registerMiddleName" v-on:keydown.native="keyhandler")
            div(v-if="registerRequiresLastName")
              .label Last name
              p.control
                input.input(v-model.trim="registerLastName" v-on:keydown.native="keyhandler")
            //- b-alert(variant="danger" show) Login Error
        .navbar-divider
        .navbar-item
          .button.is-primary.small(v-on:click="register") Register
          | &nbsp;&nbsp;
          .button.is-white.small.is-right(v-on:click="setMode('login')" v-on:keydown.native="keyhandler") Cancel
      //- mode === 'register'

      // Message for after the register email has been sent
      div(v-if="mode === 'registerAfter'")
        .navbar-item
          .label Registration
          p
            | Congratulations, you now have a user account.
            | We have sent you an email to verify your email address.
          p
            | Please take a moment to check your email and complete
            | the registration process.
        .navbar-divider
          // Should just close the dropdown VVVVV
          // b-button(:size="'sm'" :variant="'primary'" v-on:click="setMode('login')") Ok
          .button.is-primary.small.is-right(v-on:click="setMode('login')" v-on:keydown.native="keyhandler") Ok
      //- mode === 'registerAfter'
    //- .navbar-dropdown
  //- .navbar-item (in the menu bar)
</template>

<script zlang="javascript">
  import debounce from 'debounce'
  // Icons from vue-awesome
  // See https://github.com/Justineo/vue-awesome
  import 'vue-awesome/icons/refresh'
  import Icon from 'vue-awesome/components/Icon.vue'

  // const LOGIN_DETAILS_COOKIE_NAME = 'authservice-login-details'

  // VVVVV Remove these
  // const JWT_COOKIE_NAME = 'authservice-jwt'
  // const LOGIN_TIMEOUT_DAYS = 3

  // const AUTHORIZED = true
  // const NOT_AUTHORIZED = false

  /**
   *  This component provides a login menu on the navbar of a page.
   *
   *  @author Philip Callender
   */
  export default {
    name: 'authservice-navbar',
    components: {
      Icon
    },
    props: {
      /**
      *  Allow login with username (rather than email)
      */
      loginWithUsername: {
        type: Boolean,
        default: false
      },
      /**
       *  Say "sign in" rather than "log in"
       */
      signin: {
        type: Boolean,
        default: false
      },
      hideRegister: {
        type: Boolean,
        default: false
      },
      hideForgot: {
        type: Boolean,
        default: false
      },
      hideAvatar: {
        type: Boolean,
        default: false
      },
      hideLogout: {
        type: Boolean,
        default: false
      },
      // extraMenuItems: '<', // string ([+-]tag:label, ...) + = logged in, - = logged out.

      /*
       *  Registration-related
       */
      /**
       *  Which fields required for registration:
       *  u - username
       *  f - first name
       *  m - middle name
       *  l - last name
       *  p - password
       */
      registerFields: String,
      registerResume: String, // URL - where to go after email verification

      // Forgotten password related
      forgotResume: String, // URL - where to go after email verification

      nocomma: String
    },
    data () {
      // console.log('data(): this=', this)
      return {
        // email: 'philcal@mac.com',
        // password: 'mouse123',
        loggedIn: false,
        mode: (this.$authservice && this.$authservice.user) ? 'loggedIn' : 'login',

        // loginWithUsername: true,
        loginError: '',

        // Forgotten password
        forgotEmail: '',
        forgotError: '',
        forgotInProgress: false,

        // Registration-related
        registerEmail: '',
        registerUsername: '',
        registerFirstName: '',
        registerMiddleName: '',
        registerLastName: '',
        registerPassword: '',

        registerRequiresUsername: registerWithField(this, 'u'),
        registerRequiresFirstName: registerWithField(this, 'f'),
        registerRequiresMiddleName: registerWithField(this, 'm'),
        registerRequiresLastName: registerWithField(this, 'l'),
        registerRequiresPassword: registerWithField(this, 'p'),

        // freshCredentials: '<', // boolean, don't use JWT from cookie

        // // UI-related
        // signin: '<', // boolean
        // hideRegister: '<', // boolean
        // hideForgot: '<', // boolean
        // hideAvatar: '<', // boolean
        // hideLogout: '<', // boolean
        // bindToDom: '<', // boolean
        // extraMenuItems: '<', // string ([+-]tag:label, ...) + = logged in, - = logged out.
        //
        // // Registration-related
        // registerFields: '<', // string (password,first_name,middle_name,last_name)
        // registerResume: '<', // URL - where to go after email verification
        // forgotResume: '<', // URL - where to go after email verification
        //
        // // OAuth2-related
        // facebook: '<', // boolean
        // google: '<', // boolean
        // github: '<', // boolean
        // resume: '<', // URL, where to go after OAuth2 login
        // fail: '<' // URL, where to go after OAuth2 error

        user: null,
        jwt: null,
        fromCache: false,

        // The data is provided by $store.state.appList

        // How to display the fields in the table
        registerUsernameState: false,
        registerUsernameError: ''

      }
    },
    computed: {
      headerName: function () {
        if (!this.$authservice.user) {
          return '-'
        }
        if (this.$authservice.user.username) {
          return this.$authservice.user.username
        }
        if (this.$authservice.user.firstname) {
          return this.$authservice.user.firstname
        }

        // Need to use the email address
        return this.$authservice.user.email
      }// headerName
    //   usernameState () {
    //     return new Promise((resolve, reject) => {
    //       // return this.registerUsername.length > 2 ? null : false
    //       if (this.registerUsername.length > 2) {
    //         return resolve(null)
    //       } else {
    //         return reject()
    //       }
    //     })// new promise
    //   }
    },
    // Once the componented has been created, see if we are already
    // logged in (as shown by having a valid JWT in a cookie)
    created: function () {
      // console.log('============= NEW COMPONENT ================')
      // console.log('\n\n\n1 ====>', this.$authservice)
      // console.log('\n\n\n2 ====>', this.$authservice.user)
    },
    methods: {

      // Prevent the default key bindings from closing the
      // login dropdown when TAB is pressed to move between fields.
      keyhandler: function (event) {
        event.stopPropagation()
      },

      // Sign in using email/password or username/password
      doLogin: function (event) {
        console.log('doLogin(' + this.email + ', ' + this.password + ')')

        const password = this.password
        this.password = ''
        this.loginError = ''

        this.$authservice.login(this.email, password)
          .then((userDetails) => {
            this.loginError = ''
            this.mode = 'loggedIn'
            this.$emit('userchange', this.$authservice.user.id)
          })
          .catch((errmsg) => {
            this.loginError = errmsg
            this.mode = 'login'
            this.$emit('userchange', 0)
          })
        // event.stopPropagation()
        return false
      }, // doLogin

      // Sign out from the menu
      doSignout: function () {
        this.mode = 'login'
        this.email = ''
        this.password = ''

        this.$authservice.logout()
      },
      facebookLogin: function () {
        // alert('facebook login, ' + this.username + ', ' + this.password)
        this.$authservice.initiateOAuth(this, 'facebook')
      },
      githubLogin: function () {
        // alert('github login, ' + this.username + ', ' + this.password)
        this.$authservice.initiateOAuth(this, 'github')
      },
      googleLogin: function () {
        // alert('google login, ' + this.username + ', ' + this.password)
        this.$authservice.initiateOAuth(this, 'google')
      },
      linkedInLogin: function () {
        // alert('linkedin login, ' + this.username + ', ' + this.password)
        this.$authservice.initiateOAuth(this, 'linkedin')
      },
      twitterLogin: function () {
        // alert('twitter login, ' + this.username + ', ' + this.password)
        this.$authservice.initiateOAuth(this, 'twitter')
      },

      // See if a username is used
      validateUsername: function () {
        // console.log('validateUsername(' + this.registerUsername + ')')
        // Nothing to check if no username has been entered
        // Don't worry, the submit button will not be enabled
        if (this.registerUsername === '') {
          this.registerUsernameError = ''
          return
        }
        if (this.registerUsername.length < 3) {
          this.registerUsernameState = false
          this.registerUsernameError = 'Username must be 3 or more characters'
          return
        }
        return this.validateUsernameRemoteBit()
      },

      validateUsernameRemoteBit: debounce(function () {
        // console.log('validateUsernameRemoteBit (after debounce)')

        // See if the name is available
        this.validatingUsername = true
        this.registerUsernameError = ''
        this.$authservice.usernameAvailability(this.registerUsername)
          .then((error) => {
            this.registerUsernameError = error // May be null
            this.validatingUsername = false
            this.registerUsernameState = (error === null)
          })
          .catch((error) => {
            this.registerUsernameError = error
            this.validatingUsername = false
            this.registerUsernameState = false
          })// usernameAvailability()
      }, 500), // debounce (i.e. don't check every individual character)

      // Register a new user
      register: function () {
        // alert('register, ' + this.username + ', ' + this.password)
        const options = {
          email: this.registerEmail
        }
        if (this.registerRequiresUsername) {
          options.username = this.registerUsername
        }
        if (this.registerRequiresPassword) {
          options.pasword = this.registerPassword
        }
        if (this.registerRequiresFirstName) {
          options.firstName = this.registerFirstName
        }
        if (this.registerRequiresMiddleName) {
          options.middleName = this.registerMiddleName
        }
        if (this.registerRequiresLastName) {
          options.lastName = this.registerLastName
        }

        this.registerError = ''
        this.registerInProgress = true
        this.$authservice.register(options)
          .then(reply => {
            console.log('all is okay', reply)
            // Register password mail has been sent
            this.registerError = ''
            this.registerInProgress = false
            this.mode = 'registerAfter'
          })
          .catch(error => {
            // Not registered
            console.log('have error', error)
            this.registerError = error
            this.registerInProgress = false
          })
        // return true
        return false
      },

      // Handle forgotten password
      forgot: function () {
        this.forgotInProgress = true
        this.$authservice.forgot(this.forgotEmail, { forgotResume: this.forgotResume })
          .then(reply => {
            // Forgotten password mail has been sent
            this.forgotError = ''
            this.forgotInProgress = false
            this.mode = 'forgotAfter'
          })
          .catch(error => {
            // Email was not sent
            this.forgotError = error
            this.forgotInProgress = false
          })
        return true
      },

      // Set the current component mode (loggedIn, login, register, forgot, etc)
      setMode: function (mode) {
        this.mode = mode
        return false
      }
    }
  }

  // VVVVV Obsolete, no longer used
  // function setCurrentUser (me, user, jwt, fromCookie) {
  //   // console.log();
  //   // console.log('++++++++>  setCurrentUser(): ttuat=' + ttuat + ', user=', user)
  //
  //   // Change the current user.
  //   // var oldCurrentUser = user
  //   if (user) {
  //     // console.log('Setting user to ', user);
  //
  //     // // If relationships are loaded, sort the summey
  //     // if (user.relationshipSummary) {
  //     //   var arrayOfFriends = user.relationshipSummary.hasFriend
  //     //   arrayOfFriends.sort(sortRelationshipSummaryByFullname)
  //     //
  //     //   // Short those who have friended me
  //     //   var arrayOfFriendedBy = user.relationshipSummary.isFriendedBy;
  //     //   arrayOfFriendedBy.sort(sortRelationshipSummaryByFullname)
  //     // }
  //     me.user = user
  //     me.entityId = user.id
  //     if (jwt) {
  //       me.jwt = jwt
  //     }
  //     setCookieFromCurrentUser(me)
  //
  //     // VVVVV need event
  //     // if (_onUserChange) { // && oldCurrentUser==null) {
  //     //
  //     //   var newUser = getCurrentUser() // may be a clone
  //     //   var newTtuat = _ttuat
  //     //   (_onUserChange)(newUser, newTtuat, fromCookie)
  //     // }
  //   } else {
  //     // No longer logged in
  //     me.user = null
  //     me.entityId = -1
  //     me.jwt = null
  //     setCookieFromCurrentUser(me)
  //
  //     // if (_onUserChange) { // && oldCurrentUser != null) {
  //     //   var fromCookie = false
  //     //   _onUserChange(null, null, fromCookie)
  //     // }
  //   }
  // }

  /*
   *  Place the current user details and access token in a cookie,
   *  so the next page we go to knows who are logged in as.
   */
  // VVVVV Obsolete, no longer used
  // function setCookieFromCurrentUser (me) {
  //   if (me.user) {
  //     // Create a new object here, but not with all the details
  //     let cookieObj = {
  //       user: {
  //         id: me.user.id,
  //         fullname: me.user.fullname,
  //         avatar: me.user.avatar,
  //         firstname: me.user.firstname,
  //         lastname: me.user.lastname
  //       },
  //       jwt: me.jwt
  //     }
  //     console.log('Setting ' + LOGIN_DETAILS_COOKIE_NAME + ' (not sure why)')
  //     setCookie(LOGIN_DETAILS_COOKIE_NAME, JSON.stringify(cookieObj), LOGIN_TIMEOUT_DAYS)
  //   } else {
  //     // Remove the cookie
  //     console.log('Removing ' + LOGIN_DETAILS_COOKIE_NAME + ' (no current user)')
  //     setCookie(LOGIN_DETAILS_COOKIE_NAME, null, 0)
  //   }
  // }

  /*
   *    Get the current URL, and remove any Authservice parameters.
   */
  // function currentPageURL () {
  //   let l = window.location
  //   let s = l.search // ?....&....&....
  //   if (s !== '') {
  //     s = '&' + s.substring(1) // Replace initial ? with &
  //     s = s
  //       .replace(/&AUTHSERVICE_JWT=[^&]*/, '')
  //       .replace(/&AUTHSERVICE_ERROR=[^&]*/, '')
  //     if (s !== '') {
  //       s = '?' + s.substring(1) // Replace initial & with ?
  //     }
  //   }
  //   let thisPageURL = l.protocol + "//" + l.host + l.pathname + s + l.hash
  //   return thisPageURL
  // }

  // Return the URL to jump to the bounce page.
  // function getBounceURL (me, bouncePageRelativePath, resumeURL) {
  //   console.log('getBounceURL(' + bouncePageRelativePath + ',' + resumeURL + ')')
  //   if (!resumeURL) {
  //     resumeURL = currentPageURL()
  //   }
  //   let l = window.location
  //   let thisPageURL = l.protocol + "//" + l.host // + l.pathname + s + l.hash;
  //   let url = thisPageURL + bouncePageRelativePath + '?resume=' + encodeURIComponent(resumeURL)
  //   return url
  // }

  function registerWithField (me, fieldChar) {
    if (me.registerFields) {
      return (me.registerFields.indexOf(fieldChar) >= 0)
    }
    return false
  }

  // function endpoint (me) {
  //   let endpoint = '//' + me.host + ':' + me.port + '/' + me.version + '/' + me.apikey
  //   console.log('endpoint is ' + endpoint)
  //   return endpoint
  // }

</script>

<style scoped lang="scss">
.forgot-text {
  word-wrap: break-word;
  white-space: normal;
  margin-bottom: 20px;
  width: 300px;
}
.register-text {
  word-wrap: break-word;
  white-space: normal;
  margin-bottom: 20px;
  width: 300px;
}


.junk {
  .my-margins {
    border: 15px;
    background-color: pink !important;
    width: 300px !important;
  }

  .my-margins .label {
    margin-left: 50px;
  }

}
</style>
