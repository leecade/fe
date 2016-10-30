# TODO

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

1. `NODE_PATH="/usr/local/lib/node_modules" fe dev`

2. `module.paths = module.paths.concat('/usr/local/lib/node_modules')`

但跨文件没用

- [ ] avoid refresh when js modif
