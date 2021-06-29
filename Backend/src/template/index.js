const pug = require('pug');

const ExampleTemplate = pug.compileFile('./src/template/example.template.pug');

module.exports = {
    ExampleTemplate
};