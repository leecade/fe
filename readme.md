TODO

`npm i -g npm@3`

## generate

(read template define from 'fe.config.js' first, that means the generates provided by template)

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
