const MagicString = require('magic-string');
const { createFilter } = require('@rollup/pluginutils');

const defaultOpts = {
  // A RegExp to find `new Workers()` calls. The second capture group _must_
  // capture the provided file name without the quotes.
  workerRegexp: /new Worker\((["'])(.+?)\1/g,
};

module.exports = function(opts = {}) {
  opts = {
    ...defaultOpts,
    ...opts,
  };

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: "off-main-thread-es",

    resolveFileUrl({fileName}) {
      return `new URL('${fileName}', document.baseURI).href`;
    },

    async transform(code, id) {

      if (!filter(id)) {
        return;
      }

      // Copy the regexp as they are stateful and this hook is async.
      const workerRegexp = new RegExp(
        opts.workerRegexp.source,
        opts.workerRegexp.flags
      );
      if (!workerRegexp.test(code)) {
        return;
      }

      const ms = new MagicString(code);
      // Reset the regexp
      workerRegexp.lastIndex = 0;
      while (true) {
        const match = workerRegexp.exec(code);
        if (!match) {
          break;
        }

        const workerFile = match[2];

        const resolvedWorkerFile = await this.resolve(workerFile, id);

        if (resolvedWorkerFile === null) {
          throw new Error(`Cannot find module ${workerFile}`);
        }

        const chunkRefId = this.emitFile({
          type: 'chunk',
          id: resolvedWorkerFile.id,
        });

        const workerFileStartIndex = match.index + "new Worker(".length;
        const workerFileEndIndex = match.index + match[0].length;

        ms.overwrite(
          workerFileStartIndex,
          workerFileEndIndex,
          `import.meta.ROLLUP_FILE_URL_${chunkRefId}`
        );
      }

      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true })
      };
    },
  };
};
