import callstackConfig from "@callstack/eslint-config/react-native.flat.js";

export default [
  { ignores: ["node_modules", ".expo", "dist", "eslint.config.mjs"] },
  ...callstackConfig,
  // React 17+ JSX transform: no React import needed.
  { rules: { "react/react-in-jsx-scope": "off" } },
];
