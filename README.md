# miniprettier

A zero config plugin for running Prettier in Atom. It was inspired by @t9md's [mprettier] but changed to suit my needs.

- Always tries to find `prettier` in the current project `node_modules` folder. If it can't be found, it uses the one bundled in the package.
- Always tries to resolve the config for the file, and fallbacks to `miniprettier.options` (you need to edit `config.cson` manually).
- no ESLint support
- better cursor support than mprettier

## How to use?

- `miniprettier:format` or (`ctrl+alt+f`)

## Config example

See Prettier's [options](https://prettier.io/docs/en/options.html) and set them manually in `config.cson`.

```coffeescript
  miniprettier:
    options:
      singleQuote: true
      printWidth: 100
      trailingComma: "all"
```

## Credits

Thanks to @t9md for inspiration in [mprettier].

## License

[MIT](./License)

[mprettier]: https://github.com/t9md/atom-mprettier
