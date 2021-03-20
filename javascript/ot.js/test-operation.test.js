const TextOperation = require('./text-operation');

const instance = new TextOperation()
    .retain(5)
    .retain(0)
    .insert("lorem")
    .insert("")
    ['delete']("abc")
    ['delete'](3)
    ['delete'](0)
    ['delete']("");

console.warn("===================");
console.warn(instance);
console.warn(instance.toString());
console.warn("===================");
