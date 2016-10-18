# TODO

- [ ] find a way to resolve `node_modules/fe/config...` to provider some default config

- [ ] Add mock server as a middleware?

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

- [ ] avoid refresh when js modif
