import Vue from 'vue';
import Component from '../../src/components/my-component';

describe('my-component.vue', () => {
  const Constructor = Vue.extend(Component);
  const propsData = {text: 'Test text'};

  it('should instance the right component', () => {
    const vm = new Constructor({propsData});
    expect(vm.$options.name).to.equal('my-component');
  });

  it('should render correct content', () => {
    const vm = new Constructor({propsData}).$mount();
    expect(vm.$el.innerHTML).to.equal(propsData.text);
  });
});
