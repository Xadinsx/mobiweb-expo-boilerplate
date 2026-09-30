// "@vendor/x" resolves to vendors/<APP_VARIANT>/x, like Metro does.
const variant = process.env.APP_VARIANT || "default";

module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@vendor/(.*)$": `<rootDir>/vendors/${variant}/$1`,
  },
};
