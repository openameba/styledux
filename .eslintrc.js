module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'eslint-config-airbnb',
    'plugin:prettier/recommended',
    'prettier/react'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0
  }
};
