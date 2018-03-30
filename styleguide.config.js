const vueWebpackLoaders = require('vue-webpack-loaders');
const glob = require('glob').sync;
const basename = require('path').basename;

/*
 *  Phil:
 *  vue-webpack-loaders provides a set of default rules for how to load
 *  different types of files (.vue, .js, .css, etc). For a description
 *  of how these rules work see:
 *
 *  https://github.com/vue-styleguidist/vue-styleguidist/blob/master/docs/Webpack.md
 *
 *  These rules by default exclude node_modules, so this documentation creation
 *  does not know how to load vue-awesome/Icon.vue. To fix this we'll add an
 *  additional rule to those from vue-webpack-loaders.
 *
 *  See https://stackoverflow.com/questions/47331180/vue-styleguidist-error-when-dependency-contains-a-vue-file/47331181#47331181
 */
var vueLoaderConfig = require('vue-webpack-loaders/lib/vue-loader.conf')
vueWebpackLoaders.push({
  test: /vue-awesome\/components\/Icon\.vue$/,
  loader: 'vue-loader',
  options: vueLoaderConfig
})



function getDocSections() {
  b = p => basename(p, '.md');
  return glob('docs/*.md')
  .filter(path => b(path)!=='Introduction')
  .map(path => ({
    name: b(path),
    content: path
  }));
}

/**
 * More info about this styleguide configuration in
 * vue-styleguidist/vue-styleguidist github repository
 */
module.exports = {
  sections: [
    {
      /* The component itself */
      name: 'my-component documentation',
      content: 'docs/Introduction.md',
      // components: function() {
      //   return [
      //     'src/components/my-component.vue',
      //     'src/components/AuthserviceNavbar.vue',
      //     'node_modules/vue-awesome/components/Icon.vue',
      //   ]
      // },
      components: 'src/**/*.vue',
      // components: [ 'src/**/*.vue', '**/Icon.vue' ],
      // ignore: ['**/__tests__/**', '**//vue-awesome/components/Icon.vue'],
      // ignore: ['**/__tests__/**', 'node_modules/vue-awesome/components/Icon.vue'],
      ignore: ['**/__tests__/**'],
      // ignore: ['src/ignored-component/ignored-component.vue'],
      sections: getDocSections()
    },
  ],
  webpackConfig: {
    module: {
			loaders: vueWebpackLoaders,
		},
    devtool: 'inline-source-map'
  },
  serverPort: 6062,
};
