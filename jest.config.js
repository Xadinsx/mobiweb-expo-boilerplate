// Unit tests check the mechanisms, not any one vendor, so "@vendor/x" resolves to the fixed
// vendor in test/vendor. Every real vendor is checked by vendors/vendors.test.ts.
module.exports = {
  preset: "jest-expo",
  setupFiles: ["./jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@vendor/(.*)$": "<rootDir>/test/vendor/$1",
  },
};
