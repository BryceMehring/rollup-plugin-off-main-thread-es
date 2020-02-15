# rollup-plugin-off-main-thread-es

Use Rollup with workers and ES6 modules. Fork of [@surma/rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) supporting es modules.

```
$ npm install --save-dev @brycemehring/rollup-plugin-off-main-thread-es
```

Workers are JavaScript’s version of threads. [Workers are important to use][when workers] as the main thread is already overloaded, especially on slower or older devices.

## Usage

```js
// rollup.config.js
import OffMainThread from '@brycemehring/rollup-plugin-off-main-thread-es';

export default {
  input: ['src/main.js'],
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    OffMainThread(),
  ],
};
```

## Options

```js
// rollup.config.js
export default {
  // ...
  plugins: [
    OffMainThread(options),
  ],
}
```

- `workerRegexp`: A RegExp to find `new Workers()` calls. The second capture group _must_ capture the provided file name without the quotes.
- `include/exclude`: A valid minimatch pattern, or array of patterns. If options.include is omitted or has zero length, filter will return true by default. Otherwise, an ID must match one or more of the minimatch patterns, and must not match any of the options.exclude patterns.

[when workers]: https://dassur.ma/things/when-workers


