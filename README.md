<p align="center">
  <a href="https://en.wikipedia.org/wiki/Golden_Retriever">
    <img alt="FE" src="https://gitlab.pro/react/fe/uploads/d32494d5a97e1be002e933a256ccecc1/logo.png" width="586">
  </a>
</p>
<p align="center">
  <a href="http://standardjs.com/"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/fe"><img alt="npm version" src="http://img.shields.io/npm/v/fe.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/fe"><img alt="npm version" src="http://img.shields.io/npm/dm/fe.svg?style=flat-square"></a>
  <a href="https://circleci.com/gh/leecade/fe"><img alt="Circleci" src="https://img.shields.io/circleci/token/72d6756394f8489fe6d870e3fb71f2f3658a3518/project/github/leecade/fe/master.svg?style=flat-square"></a>
  <a href="https://ci.appveyor.com/project/leecade/fe"><img alt="Appveyor" src="https://img.shields.io/appveyor/ci/leecade/fe/master.svg?style=flat-square"></a>
  <a href="https://coveralls.io/github/leecade/fe"><img alt="Coveralls" src="https://img.shields.io/coveralls/leecade/fe.svg?style=flat-square"></a>
  <a href="LICENSE-MIT"><img alt="LICENSE-MIT" src="https://img.shields.io/npm/l/fe.svg?style=flat-square"></a>
  <a href="https://fe-stack.slack.com/"><img alt="Slack" src="https://img.shields.io/badge/slack-3/8-pink.svg?style=flat-square"></a>
</p>

> LOGO meaning: The [golden retriever](https://en.wikipedia.org/wiki/Golden_Retriever) is a professional guard dog with a gentle temperament, strong, very smart and friendly to their caregivers.

----

> :beer: Basic available, still work in progress. See my [work plan](TODO.md) here.

### BETA VERSION CHANGELOG

- [0.1.21]
  + [Improve] Add auto publish hook

- [0.1.20]
  + [default config] Change default public path to `/` to fix bundle url error in child-routing + browser router
  + [Bug] Fixes default behavior of touch to avoid `undefined` content
  + [Install script] Improve double refresh environment variable

## Developer Guide

```sh
$ git clone
$ yarn # or npm i
$ yarn dev
$ npm link # you got the global `fe`
```

release

```sh
$ npm run build
$ npm version patch -m "bump version"
$ npm publish # auto bump version
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

That's all that matters, now let's get started:

```sh
$ fe d # alias `fe dev`
```

> Type Enter if requested to generate entry file

Now that we are in dev mode, you may edit the `src/index.js` with liveload supports.

Next, we initialize React environment:

```sh
$ npm init -y
$ npm i react react-dom -S
```

Following the [react tutorial](https://facebook.github.io/react/), we put some code in `src/index.js`

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

Great! It works. Next Step: we fetch some mock data:

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
  "PROXY": {
    "/api": {
      "target": "http://localhost:3000/",
      "pathRewrite": {"^/api": "/_mock"}
    }
  },
  "inChina": true,
  "FE_CONFIG_FILE": "fe.config.json",
  "BUILD_DIR": "build",
  "CONFIG_DIR": "config",
  "MOCK_DIR": "mock",
  "PUBLIC_DIR": "public",
  "SRC_DIR": "src",
  "EMPTY_FILE": "config/empty.js",
  "TEMPLATE_FILE": "config/template.ejs",
  "ENTRY_FILE": "src/index.js",
  "POLYFILLS_FILE": "config/polyfills.js",
  "HTML_FILE": "public/index.html",
  "TEST_SETUP_FILE": "config/setupTests.js",
  "publicPath": ""
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
| [fe-datepicker](https://github.com/fe-components/fe-datepicker) | |
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
