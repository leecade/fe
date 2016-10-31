# TODO

## Open Source

- [ ] homepage base on hexo

- [ ] release standone install package (7niu?)

- [ ] more platform install way: brew / chocolatey / apt-get / yum / pac

> brew require: GitHub repository not notable enough (<20 forks, <20 watchers and <50 stars)

## Build

- [ ] avoid refresh when js file change

## CLI

- [ ] Cache boilerplate in ~/.fe & md5 check update

> So we can use the generator tasks in boilerplate/generator

- [ ] update generator / fe version after init

- [ ] implement optimize-js

- [ ] Design generator task

- [x] find a way to resolve `node_modules/fe/config...` to provider some default config

- [x] Add mock server as a middleware?

- [x] `babel-core` / `presets` / `loader` must install local

`babel-core` / `loader`

```
resolveLoader: {
  // An array of directory names to be resolved to the current directory
  modules: ['node_modules', 'node_modules_custom', helpers.root('src')],
},
```

`presets`

```
query: {
  'presets': [
    require.resolve('babel-preset-fe')
  ],
```

Some ENV failed: `require.resolve`

console.log(module.paths)

```
[ '/Users/yuji/gitlab/fe/bin/node_modules',
  '/Users/yuji/gitlab/fe/node_modules',
  '/Users/yuji/gitlab/node_modules',
  '/Users/yuji/node_modules',
  '/Users/node_modules',
  '/node_modules' ]
```

fix:

- `NODE_PATH="/usr/local/lib/node_modules" fe dev`

- `module.paths = module.paths.concat('/usr/local/lib/node_modules')`

> not work if requird and within another file
