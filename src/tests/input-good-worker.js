const test = 1;

const worker = new Worker('./worker.js', { type: 'module' });

console.log(test);