module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'xo', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  parser: 'vue-eslint-parser',
  plugins: ['vue', 'prettier'],
  rules: {
    'no-undef': 'off',
    'no-useless-constructor': 'off',
    'max-params': 'off',
    'new-cap': ['error', { newIsCapExceptions: ['Given', 'When', 'Then', 'And'] }],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/multi-word-component-names': 'off'
  }
};
