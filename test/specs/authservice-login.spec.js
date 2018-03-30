import Vue from 'vue';
import Module from '../../src/index';
import Component from '../../src/components/AuthserviceNavbar';

describe('AuthserviceNavbar.vue', () => {
  Vue.use(Module)
  const authservice = new Module({
    host: 'localhost',
    port: 9090,
    version: 'v2',
    apikey: 'drinkcircle'
  })
  // new Vue({
  //   render: h => h(App),
  //   authservice // inject authservice to all children
  // })
  const propsData = {
    render: h => h(App),
    authservice // inject authservice to all children
  }

  // const propsData = {text: 'Test text'};
  const Constructor = Vue.extend(Component);

  it('should instance the right component', () => {
    const vm = new Constructor(propsData);
    expect(vm.$options.name).to.equal('authservice-navbar');
  });

  it('instance should contain _authserviceRoot', () => {
    const vm = new Constructor(propsData);
    should.exist(vm._authserviceRoot)
  });

  it('instance should contain $authservice', () => {
    const vm = new Constructor(propsData);
    // const vm = new Constructor({
    //   render: h => h(App),
    //   authservice // inject authservice to all children
    // });
    // console.log(vm);
    should.exist(vm.$authservice)
  });

  it('user should be null', () => {
    const vm = new Constructor(propsData);
    // should.exist(vm._authserviceRoot)
    // expect(vm.$authservice.user).to.be(null);
    // expect(vm.$authservice.user).to.be(null)
    should.not.exist(vm.$authservice.user);
  });

  it('$authservice.login should be a function', () => {
    const vm = new Constructor(propsData);
    // should.exist(vm._authserviceRoot)
    // expect(vm.$authservice.user).to.be(null);
    // expect(vm.$authservice.user).to.be(null)
    // should.not.exist(vm.$authservice.user);
    expect(vm.$authservice.login).to.be.a('function');
  });

  it('bad login should fail', (done) => {
    const vm = new Constructor(propsData);
    const email = 'fred'
    const password = 'dudpassword'
    vm.$authservice.login(email, password)
      .then((userDetails) => {
        expect().fail("Login with bad credentials did not fail")
        done()
      })
      .catch((errmsg) => {
        // console.log('Login failed as expected', errmsg);
        // this.loginError = errmsg
        // this.mode = 'login'
        // this.$emit('userchange', 0)
        try {
          should.not.exist(vm.$authservice.user);
          expect(errmsg).to.equal('Incorrect username / password');
        } catch(e) {
          return done(e);
        }
        done()
      })
    // should.not.exist(vm.$authservice.user);
  });

  it('correct login should succeed', (done) => {
    const vm = new Constructor(propsData);
    const email = 'philcal@mac.com'
    const password = 'mouse123'
    vm.$authservice.login(email, password)
      .then((userDetails) => {
        try {
          // console.log('good login', vm.$authservice.user);
          expect(vm.$authservice.user.authority).to.equal('email');
          expect(vm.$authservice.user.firstname).to.equal('Philip');
          expect(vm.$authservice.user.middlename).to.equal('Boyd');
          expect(vm.$authservice.user.lastname).to.equal('Callender');
          expect(vm.$authservice.user.email).to.equal('philcal@mac.com');
        } catch(e) {
          return done(e);
        }
        done()
      })
      .catch((errmsg) => {
        expect().fail("Login failed: " + errmsg)
        done()
      })
    // should.not.exist(vm.$authservice.user);
  });

  it('logout should succeed', (done) => {
    const vm = new Constructor(propsData);
    vm.$authservice.logout()
      .then((userDetails) => {
        try {
          should.not.exist(vm.$authservice.user);
        } catch(e) {
          return done(e);
        }
        done()
      })
      .catch((errmsg) => {
        expect().fail("Logout failed: " + errmsg)
        done()
      })
    // should.not.exist(vm.$authservice.user);
  });

  // it('should render correct content', () => {
  //   const vm = new Constructor({propsData}).$mount();
  //   expect(vm.$el.innerHTML).to.equal(propsData.text);
  // });
});
