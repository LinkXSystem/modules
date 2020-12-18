const Acorn = require('acorn');

const code = `
// TODO: this is comment !!
const r = 10 + 10;
console.log('result: ', r);
`;

const ast = Acorn.parse(code, {
    onComment: (comment) => {
        console.warn('comment: ', comment);
    }
});

const token = [...Acorn.tokenizer(code, {})];

console.warn('token: ', token);