/* eslint-disable */
module.exports = {
  lintOnSave: false,
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/v-slot-style': ['error', {
      allowedSymbols: ['default'],
    }],
    'vue/valid-v-slot': ['error'],

    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
  }
}
