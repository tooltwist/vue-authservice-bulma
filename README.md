# my-component

> A Vue.js component module

# Usage

## ES6 Modules / CommonJS

```bash
$ npm run build
```

```js
import MyComponent from 'dist/my-component';

Vue.component('my-component', MyComponent);
```

```html
<my-component text="Hello World!"></my-component>
```

## UMD

```bash
$ npm run build:umd
```

```html
<my-component text="Hello World!"></my-component>

<script src="https://unpkg.com/vue" charset="utf-8"></script>
<script src="./dist/my-component.min.js" charset="utf-8"></script>

<script type="text/javascript">
  Vue.component('my-component', window.MyComponent);
</script>
```

## Installation

### Using yarn

`yarn add my-component`

### Using npm

`npm i --save my-component`

## Demo and Docs

`npm run serve`

## Tests

This template uses karma with chai by default, you can change test settings in poi.config.js

`npm run test`
`npm run test:watch`
`npm run test:cov`

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)
