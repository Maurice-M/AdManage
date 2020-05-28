module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'eol-last': 0,
    'spaced-comment': 0,
    'quote-props': 0,
    'no-unused-vars': 0,
    'no-useless-return': 0,
    'handle-callback-err': 0
  }
}
