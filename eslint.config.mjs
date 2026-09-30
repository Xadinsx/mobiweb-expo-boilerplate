import callstackConfig from "@callstack/eslint-config/react-native.flat.js";

export default [
  { ignores: ["node_modules", ".expo", "dist", "eslint.config.mjs", "babel.config.js", "metro.config.js", "jest.config.js"] },
  ...callstackConfig,
  {
    settings: {
      // Resolve the "@/" alias from tsconfig.json.
      "import/resolver": { typescript: true, node: true },
    },
    rules: {
      // React 17+ JSX transform: no React import needed.
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    // Tool config files may import dev dependencies.
    files: ["steiger.config.mjs"],
    rules: { "import/no-extraneous-dependencies": ["error", { devDependencies: true }] },
  },
];
