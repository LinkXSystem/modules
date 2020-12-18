const compiler = require('../index');

(function () {
    const content = '(add 2 (subtract 4 2))';
    const ast = compiler.compile(content);

    console.warn('========================');
    console.warn(ast);
    console.warn('========================');
})();