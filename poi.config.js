const presetKarma = require('poi-preset-karma');
const webpack = require('webpack');
const glob = require('glob').sync;
const {name} = require('./package.json');

module.exports = {
  // entry: glob('./src/**/*.vue'),
  entry: './src/index.js',
  filename: {
    js: name + '.min.js',
  },
  sourceMap: true,
  html: false,
  presets: [
    presetKarma({
      files: [
        // Use babel-polyfill, so that Promise is defined.
        // See https://stackoverflow.com/questions/29391111/karma-phantomjs-and-es6-promises
        'node_modules/babel-polyfill/dist/polyfill.js',
        './test/specs/**.spec.js'
      ],
      browsers: ['PhantomJS'],
      frameworks: ['mocha', 'chai', 'phantomjs-shim'],
    })
  ],
  moduleName: 'MyComponent'
};
