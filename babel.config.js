module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Unistyles rewrites StyleSheet usage in src/ at build time.
    plugins: [["react-native-unistyles/plugin", { root: "src" }]],
  };
};
