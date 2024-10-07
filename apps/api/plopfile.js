module.exports = (plop) => {
  plop.setHelper(
    'capitalize',
    (text) => text.charAt(0).toUpperCase() + text.slice(1),
  )
  plop.setGenerator('module', {
    description: 'Nest.js module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter the module name:',
      },
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'src/{{name}}',
        templateFiles: '.plop/module/**/*',
        base: '.plop/module',
      },
    ],
  })
}
