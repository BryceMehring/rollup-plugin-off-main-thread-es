const OffMainThread = require('./plugin');
const { rollup } = require('rollup');

const generateAndVerify = async (build, length) => {
  const { output } = await build.generate({
    format: 'es',
  });

  expect(output).toHaveLength(length);

  for (const chunk of output) {
    expect(chunk.code).toMatchSnapshot();
  }
}

describe('plugin', () => {
  it('throw exception if file cannot be found', () => {
    return expect(rollup({
      input: './src/tests/input-bad-worker.js',
      plugins: [
        OffMainThread(),
      ]
    })).rejects.toThrowError();
  });

  it('does nothing when cannot find worker', async () => {
    const build = await rollup({
      input: './src/tests/input-noop.js',
      plugins: [
        OffMainThread(),
      ]
    });

    return generateAndVerify(build, 1);
  });

  it('excludes input files', async () => {
    const build = await rollup({
      input: './src/tests/input-good-worker.js',
      plugins: [
        OffMainThread({
          exclude:  './src/tests/input-good-worker.js',
        }),
      ]
    });

    return generateAndVerify(build, 1);
  })

  it('builds worker', async () => {
    const build = await rollup({
      input: './src/tests/input-good-worker.js',
      plugins: [
        OffMainThread({
          include: './src/tests/input-good-worker.js',
        }),
      ]
    });

    return generateAndVerify(build, 2);
  });
})