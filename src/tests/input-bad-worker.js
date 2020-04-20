const test = 1;

const worker = new Worker('./bad-worker.js', { type: 'module' });

console.log(test);