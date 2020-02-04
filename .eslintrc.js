module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    'no-multiple-empty-lines': [2, {'max': 2}],
    'object-curly-spacing': [0, 'never'],
    'space-in-parens': [0, 'never'],
    'indent': ['off', 2],
    'eqeqeq': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    }
  ]
}
