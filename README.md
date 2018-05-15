# styledux

A new approach of isomorphic css resolution with webpack, css-loader(css-modules) powered by redux.

IT'S **style-dux**, not styled-ux.

Status: `beta`

## Features

* [x] Plain, simple, original css with css modules (with Webpack css-loader). Also support LESS, SCSS, Sass, Stylus, PostCSS...
* [x] NO extra editor plugin required, because it's only **PLAIN css** + jsx.
* [x] **Universal javascript** support (Server side rendering + Client side rendering)
* [x] **Thread-safe** server side rendering, renderToNodeStream() / renderToStaticNodeStream() is OK.
* [x] Remove styles when render() returns null automatically
* [x] **Middleware** support (Powered by [redux](https://github.com/reduxjs/redux))
* [x] Webpack Hot Module Replacement (HMR)

## Installation

**For npm**

``` shell
npm install styledux
```

**For yarn**

``` shell
yarn add styledux
```

## Usage

### 1. Configuration

Add `styledux/loader` before `css-loader` to your webpack configuration.

```
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        {
          loader: 'styledux/loader'
        },
        {
          loader: 'css-loader',
          options: {
            modules: true, // css modules support, important!!
            importLoaders: 1,
            localIdentName: process.env.NODE_ENV === 'production' ? '_[hash:base64:8]' : '[name]__[local]___[hash:base64:5]',
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: true,
          }
        },
        {
          loader: 'postcss-loader'
        }
      ]
    }
  ]
}
```

> `styledux/loader` is simply to export locals that generated from css-loader and wrap original css contents with a function `_()`.

### 2. Decorate React components with `@withStyle`

`ExampleComponent.css`

```css
.Block {
  background-color: green;
  display: block;
  left: 0;
  opacity: 0;
  position: fixed;
  width: 200px;
  height: 200px;
}

.SubModule {
  background-color: blue;
  display: block;
  width: 20px;
  height: 20px;
}
```

`ExampleComponent.js`

```jsx
import { withStyle } from 'styledux'

import style from './ExampleComponent.css';

@withStyle(style)
export class ExampleComponent extends React.Component {
    render() {
      return (
        <div className={style.Block}>
          <div className={style.SubModule} />
        </div>
      );
    }
}
```

For stateless component

`ExampleStatelessComponent.js`

``` js
import { withStyle } from 'styledux'

import style from './ExampleComponent.css';

function ExampleStatelessComponent() {
  return (
    <div className={style.Block}>
      <div className={style.SubModule} />
    </div>
  );
}
const component = withStyle(style)(ExampleStatelessComponent);
export default component;
```

### 3. Server side rendering

``` jsx
import ReactDOMServer from 'react-dom/server';
import { createStyleduxStore, StyleduxProvider, mapStateOnServer } from 'styledux';

export function renderHTML(App) {
  const styleStore = createStyleduxStore();
  const appHtml = ReactDOMServer.renderToString(
    <StyleduxProvider store={styleStore}>
      <App />
    </StyleduxProvider>
  );
  const styles = mapStateOnServer(styleStore);
  return [
    '<!doctype html><html><head>',
    ...styles,
    '<style id="main_css"></style>', // for options.insertInto on client side
    // You can also add other styles which have higher priority
    '</head><body><div id="app">',
    appHtml,
    '</div></body></html>',
  ].join('');
}
```

### 4. Client Side Rendering

``` jsx
import ReactDOM from 'react-dom';
import { createStyleduxStore, StyleduxProvider, handleStateChangeOnClient } from 'styledux';

function rehydrateApp(App) {
  ReactDOM.hydrate(
    <StyleduxProvider store={createStyleduxStore(handleStateChangeOnClient({ insertAt: '#main_css' }))}>
      <App />
    </StyleduxProvider>,
    document.getElementById('app')
  );
}
```

# API

#### `<StyleduxProvider store>`

See https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store

##### `Props`

- `store`: Plain redux store that created with `createStyleduxStore()`
- `children`

##### Example:

``` jsx
import { StyleduxProvider } from 'styledux';

ReactDOM.render(
  <StyleduxProvider store={styleStore}>
    {your_app_component}
  </StyleduxProvider>,
  rootElement
)
```

#### `createStyleduxStore(...middlewares)`

##### Arguments

- middlewares: Plain redux middlewares.

You can create your own middlewares to handle state changes.

`handleStateChangeOnClient(options)` creates a middleware that mount styles like `style-loader`.

##### Example

**On server:**

``` js
import { createStyleduxStore } from 'styledux';

const styleStore = createStyleduxStore();
```

**On client:**

``` js
import { createStyleduxStore, handleStateChangeOnClient } from 'styledux';

const middleware = handleStateChangeOnClient({ insertAt: '#main_css' });
const styleStore = createStyleduxStore(middleware);
```

#### `withStyle(style)`

Decorate a react component with style. It monitors `render()` of react component.

It dispatches an `ADD_STYLE` action when `render()` returned non-empty result, and dispatches a `REMOVE_STYLE` action when `render()` returned `null`.

##### Arguments

- style (Object | Array): style object that was generated by `styledux/loader`.

##### Example

```js
import { withStyle } from 'styledux';

import style1 from './style1.css';
import style2 from './style2.css';

@withStyle([style1, style2])
class ExampleComponent extends React.Component {
}
```

```js
import { withStyle } from 'styledux';

import style from './style.css';

@withStyle(style)
class ExampleComponent extends React.Component {
}
```

### `mapStateOnServer(options)` and `handleStateChangeOnClient(options)`

The built-in adapter for styledux.

When you build a universal web application, make sure `mapStateOnServer(options)` and `handleStateChangeOnClient(options)` use the same options.

#### options:

- `attrs` (Object): Add custom attrs to `<style></style>` (**default: {}**).
- `transform` (Function): Transform/Conditionally load CSS by passing a transform/condition function. (**default: (obj) => obj **)
- `transformId` (Function): Transform webpack module id to element id. (**default: ** see [getOptions](packages/styledux-adapter-default/src/getOptions.js) )
- `insertAt` (null|String): Inserts <style></style> at the given position. Different from `style-loader`. (**default: null**)
- `insertInto` (String): Inserts <style></style> into the given position. (**default: <head>**)

#### `mapStateOnServer(styleduxStore, options)`

Only required for server-side rendering. Generate `<style>` from styleduxStore on server side.

##### Example

``` js
const styleStore = createStyleduxStore();
const content = ReactDOMServer.renderToString(
  <StyleduxProvider store={styleStore}>
    <App />
  </StyleduxProvider>
);
const styles = mapStateOnServer(styleStore);

const html = [
  '<!doctype html><html><head>',
  ...styles,
  '<style id="main_css"></style>', // The position for insert_at
  '<link rel="stylesheet" type="text/css" href="custom_theme.css">', // Other styles that may have higher priority
  '<script src="main.js" defer></script>',
  '</head><body><div id="app">',
  content,
  '</div></body></html>'
].join('');
```

#### `handleStateChangeOnClient(options)`

Handling state changes and mount styles dynamically on client side.

##### Example

``` js
const styleStore = createStyleduxStore(handleStateChangeOnClient({
  insertAt: '#main_css'
}));

const app = (
  <StyleduxProvider store={styleStore}>
    <App />
  </StyleduxProvider>
);
ReactDOM.hydrate(app, document.getElementById('app'));
```

## LICENSE

MIT
