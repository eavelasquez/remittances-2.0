module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-underscore-dangle': 0,
    'arrow-body-style': 0,
    'no-shadow': 0,
    'consistent-return': 0,
    'no-nested-ternary': 0,
    'no-console': 1,
    'func-names': 0,
    'no-undef': 0,
    'indent': 0,
    'no-unused-vars': 1,
    'react/function-component-definition': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/button-has-type': 0,
    'no-case-declarations': 0,
    'import/prefer-default-export': 0,
  },
};