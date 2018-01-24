// jest.config.js
module.exports = {
  // By default, Jest runs all tests and produces all errors into
  // the console upon completion. The bail config option can be
  // used here to have Jest stop running tests after the first failure.
  bail: true,

  notify: true,
  verbose: true,
  roots: ['<rootDir>/app/'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testURL: 'http://localhost:8080'
  // An array of regexp pattern strings that are matched against all
  // test paths before executing the test.
  // Default: ["/node_modules/"]
  // testPathIgnorePatterns: ["<rootDir>/tests/E2E/", "<rootDir>/node_modules/"]
}
