module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      // adicione aqui os presets que você está usando, por exemplo:
      'plugin:vue/essential',
      'eslint:recommended',
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
    parserOptions: {
      parser: 'babel-eslint',
    },
  };
  