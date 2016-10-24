<p align="center">
  <a href="https://en.wikipedia.org/wiki/Golden_Retriever">
    <img alt="react-native-swiper" src="https://gitlab.pro/react/fe/uploads/8786e1093d9673d38c3ec1d4f8948c07/fe-logo.png" width="586">
  </a>
</p>

<p align="center">
  <a href="http://standardjs.com/"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/fe"><img alt="npm version" src="http://img.shields.io/npm/v/fe.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/fe"><img alt="npm version" src="http://img.shields.io/npm/dm/fe.svg?style=flat-square"></a>
  <a href="https://github.com/leecade/fe/pulls?q=is%3Apr+is%3Aclosed"><img alt="PR Stats" src="https://img.shields.io/issuestats/i/github/leecade/fe.svg?style=flat-square"></a>
  <a href="https://github.com/leecade/fe/issues?q=is%3Aissue+is%3Aclosed"><img alt="Issue Stats" src="https://img.shields.io/issuestats/p/github/leecade/fe.svg?style=flat-square"></a>
  <a href="https://gitter.im/leecade/fe?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge"><img alt="Join the chat" src="https://badges.gitter.im/leecade/fe.svg"></a>
</p>

# FE

TODO

## generate

(read template define from 'fe.config.js' first, that means the generates provided by template)

## Getting Started ##

- component

- container

```
container/Login
  action.js
  index.js
  initState.js
  reducer.js
```

- router

```
```

- helper

## templates

- redux

- mobx


## Hotloading

- Only one running node process
- Client-side Redux reducer hot reloading
- Server-side Redux reducer hot reloading
- Client-side React component hot reloading
- Server-side React component hot reloading
- Server-side express routes hot reloading
- Client side css-modules hot reloading
- Data fetching through a remote API
- Multiple pages via Routing

## Thoughts

### How to extends config:

if those files exists, merge to FE config

```
src/config/webpack.js
src/config/webpack.dev.js
src/config/webpack.prod.js
```

### How to extends tasks

src/taskfile.js

```js
import { run } from 'runjs';

const task = {
    'create:component': (name) => {

    },
    'build:js': () => {
      run('webpack -p --config config/webpack/prod.js --progress');
    },
    'build:css': () => {

    },
    'build': () => {
      task['build:js']();
      task['build:css']();
    }
};

export default task
```

### install

- bash

https://yarnpkg.com/install.sh

- brew

https://github.com/Homebrew/homebrew-core/blob/d3569ec6e346a8aa1ef65e04628b02b7e9e0dcf4/Formula/yarn.rb

## ENV
dev
prod
ci
test

## GLOBAL

config/
babel.dev.js
babel.build.js
polyfills.js
paths.js
env.js

## LOCAL

config/
babel.dev.js
babel.build.js
polyfills.js
paths.js
env.js

pkg/
react
immutable
redux


fe init xxx
1. grab the template thorgh git
2. replace
3. npm i
