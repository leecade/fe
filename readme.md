<p align="center">
  <a href="https://en.wikipedia.org/wiki/Golden_Retriever">
    <img alt="FE" src="https://gitlab.pro/react/fe/uploads/d32494d5a97e1be002e933a256ccecc1/logo.png" width="586">
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

> LOGO means: The [golden retriever](https://en.wikipedia.org/wiki/Golden_Retriever) is a professional guard dog, gentle temperament, strongly, also very smart and friendly to their caregivers.

----

> :beer: Basic available, still work in progress, put my [work plan](TODO.md) here.

## Developer Guide

```sh
$ git clone
$ yarn # or npm i
$ yarn dev
$ npm link # you got the global `fe`
# change package.json version then
$ npm publish
# build the release pkg
$ yarn release # change the tar download url if you have another one
```

----

# FE Stack

![screenshot](https://gitlab.pro/react/fe/uploads/1493f976f411e120f0ce77fb0a878e6c/image.png)

## Motivation

TODO

## Install

- *nix(OSX / Debian / Centos ...)

```
curl https://raw.githubusercontent.com/leecade/fe/master/scripts/install.sh -L -o - | sh
```

> Recommend Chinese users

- General install through node

```
npm install fe -g
```

- OSX

TODO

```
$ brew install fe
```

- Windows

TODO

## Get started

### The quickly and manual way

Just create a json file named `fe.config.json`(labeling the root location of your project)

```sh
$ touch fe.config.json
```

That's all that matters, let's get started:

```sh
$ fe d # alias `fe dev`
```

> Type Enter if be requested to generate entry file

Now we are in dev mode, you may edit the `src/index.js` with liveload supports.

Next step, we initialize React environment:

```sh
$ npm init -y
$ npm i react react-dom -S
```

Follow the [react tutorial](https://facebook.github.io/react/), we put some code in `src/index.js`

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'
class HelloMessage extends Component {
  state = {
    name: 'FE Stack'
  }
  render() {
    return <div>Hello {this.state.name}</div>
  }
}
render(<HelloMessage name="Jane" />, document.getElementById('root'))
```

Great! It works, Next Step, We try to fetch some mock data:

```sh
$ mkdir -p mock/TaskList
$ touch mock/TaskList/index.js
```

Put the following code in `mock/TaskList/index.js`:

```js
module.exports = [{
  method: 'GET',
  route: '/task-list',
  handler: {
    "data": [{
      "name": "task1"
    }, {
      "name": "task2"
    }]
  }
}]
```

Then restart `fe d` and update `src/index.js`:

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'
class HelloMessage extends Component {
  state = {
    name: 'FE Stack',
    mockData: ''
  }
  componentDidMount () {
    fetch('/api/task-list')
        .then(res => res.json())
        .then(mockData => this.setState(Object.assign({}, this.state, { mockData })))
  }
  render() {
    return <div>Hello {this.state.name}, {JSON.stringify(this.state.mockData)}</div>
  }
}
render(<HelloMessage name="Jane" />, document.getElementById('root'))
```

> See [src/config/default.js](src/config/default.js) for more information about `fe.config.json`

```json
{
  "TITLE": "PAGE_TITLE",
  "HOST": "localhost",
  "HTTPS": false,
  "DEV_SERVER_PORT": 3000,
  "MOCK_PREFIX": "/_mock",
  // an example proxy to mock server
  // you may replace by your back-end server
  "PROXY": {
    "/api": {
      "target": "http://localhost:3000/",
      "pathRewrite": {"^/api": "/_mock"}

      // Or throgh bypass
      // bypass: req => {
      //   return req.url.replace(/^\/api(.+)$/, '/_mock$1')
      // }
    }
  },

  // Auto detect
  inChina: undefined,
  FE_CONFIG_FILE: "fe.config.json",
  BUILD_DIR: "build",
  CONFIG_DIR: "config",
  MOCK_DIR: "mock",
  PUBLIC_DIR: "public",
  SRC_DIR: "src",
  EMPTY_FILE: "config/empty.js",
  TEMPLATE_FILE: "config/template.ejs",
  ENTRY_FILE: "src/index.js",
  POLYFILLS_FILE: "config/polyfills.js",
  HTML_FILE: "public/index.html",
  TEST_SETUP_FILE: "config/setupTests.js",
  publicPath: ""
}
```

### The right and concise way

```sh
$ fe init mydemo
```

## Ecosystem

```sh
$ fe list
```

### Available official [components](https://github.com/fe-components)

| component name        | description  |
| ------------- |:-------------|
| [fe-reset](https://github.com/fe-components/fe-reset) | CSS reset implementation in FE stack |
| [fe-datepicker](https://github.com/fe-components/fe-datepicker) | redux+route4+immutable |
| [fe-upload](https://github.com/fe-components/fe-upload) |  |
| [fe-table](https://github.com/fe-components/fe-table) |  |
| [fe-pagination](https://github.com/fe-components/fe-pagination) | |
| [fe-input](https://github.com/fe-components/fe-input) | |
| [fe-select](https://github.com/fe-components/fe-select) | |
| [fe-form](https://github.com/fe-components/fe-form) | |
| [fe-modal](https://github.com/fe-components/fe-modal) | |
| [fe-button](https://github.com/fe-components/fe-button) | |

### Available official [boilerplates](https://github.com/fe-boilerplate)

| boilerplat name        | description  |
| ------------- |:-------------|
| [basic](https://github.com/fe-boilerplate/basic) | A basic boilerplate |
| [redux](https://github.com/fe-boilerplate/redux) | redux+route4+immutable |
| [mobx](https://github.com/fe-boilerplate/mobx) | TODO |
| [dva](https://github.com/fe-boilerplate/dva) | TODO |
| [ant](https://github.com/fe-boilerplate/ant) | TODO |
| [ant](https://github.com/fe-boilerplate/ant) | TODO |
