module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      root: [
        './src',
      ],
      "alias": {
        "view": "./src/view",
      }
    }],
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  }
};
