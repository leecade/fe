<p align="center">
  <a href="https://en.wikipedia.org/wiki/Golden_Retriever">
    <img alt="FE" src="https://gitlab.pro/react/fe/uploads/d32494d5a97e1be002e933a256ccecc1/logo.png" width="586">
  </a>
</p>
<p align="center">
  <a href="https://github.com/leecade/fe"><img alt="FE Stack" src="https://img.shields.io/badge/FE-Stack-blue.svg?style=flat-square&colorA=333&colorB=4A90E2"></a>
  <a href="http://standardjs.com/"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/fe"><img alt="npm version" src="http://img.shields.io/npm/v/fe.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/fe"><img alt="npm version" src="http://img.shields.io/npm/dm/fe.svg?style=flat-square"></a>
  <a href="https://circleci.com/gh/leecade/fe"><img alt="Circleci" src="https://img.shields.io/circleci/token/72d6756394f8489fe6d870e3fb71f2f3658a3518/project/github/leecade/fe/master.svg?style=flat-square&label=build&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y%2BmAAAAdVBMVEUAAAC7u7upqam4uLi7u7uysrK6urq6urq7u7u6urq7u7u7u7u6urq5ubm3t7e7u7u7u7u7u7u6urq5ubm2tra7u7u7u7u7u7u6urq5ubm6urq4uLi7u7u6urq7u7u7u7u1tbW6urq6urq6urq7u7u6urq7u7uZ6jesAAAAJnRSTlMA%2BAke5xPwbbZ%2FdWZSLij0r51eNA7p2b6cTTwZ39TERRamklXKl9fT8SUAAAD3SURBVCjPhZPrGoIgDIYHAmKgZZppdrAT93%2BJoWuF6ZPvr08%2BGRsb8IEXZs9EbiOYECUnhyh95yOLr4QLOB8Cr9u4Mev447UPNyGhmHs3g0EzcYQ4VWvSKu29jL6vF8l5FlcO0b2Zo1YWEHnFBeZTbhXK5lvXO%2FcawKK69ctlkQ0XshuWjiW0JvYY6RcvlWObXtwwWAoEbci9ajBaE5hbLMdvTdkgt0vmNKylsNFqoA0Tqt8J0V95UEqmqJQOi2J4QNiI2usnSmboaE3XF168tlEpi0TQ50%2FL1FGwccuA6z%2FNhu48NyaEnB8wIp6O5vJQj59DHT6HF7O7OuRQVm7zAAAAAElFTkSuQmCC"></a>
  <a href="https://ci.appveyor.com/project/leecade/fe"><img alt="Appveyor" src="https://img.shields.io/appveyor/ci/leecade/fe.svg?style=flat-square&logo=data%3Aimage%2Fsvg%2Bxml%2C%3Csvg+xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27+width%3D%2740%27+height%3D%2740%27+viewBox%3D%270+0+40+40%27%3E%3Cpath+fill%3D%27%23BBB%27+d%3D%27M20+0c11+0+20+9+20+20s-9+20-20+20S0+31+0+20+9+0+20+0zm4.9+23.9c2.2-2.8+1.9-6.8-.9-8.9-2.7-2.1-6.7-1.6-9+1.2-2.2+2.8-1.9+6.8.9+8.9+2.8+2.1+6.8+1.6+9-1.2zm-10.7+13c1.2.5+3.8+1+5.1+1L28+25.3c2.8-4.2+2.1-9.9-1.8-13-3.5-2.8-8.4-2.7-11.9+0L2.2+21.6c.3+3.2+1.2+4.8+1.2+4.9l6.9-7.5c-.5+3.3.7+6.7+3.5+8.8+2.4+1.9+5.3+2.4+8.1+1.8l-7.7+7.3z%27%2F%3E%3C%2Fsvg%3E"></a>
  <a href="https://coveralls.io/github/leecade/fe"><img alt="Coveralls" src="https://img.shields.io/coveralls/leecade/fe.svg?style=flat-square"></a>
  <!-- <a href="LICENSE-MIT"><img alt="LICENSE-MIT" src="https://img.shields.io/npm/l/fe.svg?style=flat-square"></a> -->
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

Depends on

 - node 4+
 - npm 3+

### *nix(OSX / Debian / Centos ...)

```
curl https://raw.githubusercontent.com/leecade/fe/master/scripts/install.sh -L -o - | sh
```

> Recommend Chinese users

### General install through node

```
npm install fe -g
```

### OSX

TODO

```
$ brew install fe
```

> use `curl https://raw.githubusercontent.com/leecade/fe/master/scripts/install.sh -L -o - | sh` fallback first

### Windows

TODO

> use `npm i -g fe` fallback first

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

![FE Stack](https://img.shields.io/badge/FE-Stack-blue.svg?style=flat-square&colorA=333&colorB=4A90E2)

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
