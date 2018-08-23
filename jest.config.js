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
  testURL: 'http://localhost:8080',
  // An array of regexp pattern strings that are matched against all
  // test paths before executing the test.
  // Default: ["/node_modules/"]
  // testPathIgnorePatterns: ["<rootDir>/tests/E2E/", "<rootDir>/node_modules/"]
  moduleNameMapper: {
    '^actions/(.*)': '<rootDir>/app/store_actions/$1',
    '^assets/(.*)': '<rootDir>/app/static/$1',
    '^components/(.*)': '<rootDir>/app/views/components/$1',
    '^constants/(.*)': '<rootDir>/app/constants/$1',
    '^dashboard/(.*)': '<rootDir>/app/components/Dashboard/$1',
    '^models/(.*)': '<rootDir>/app/models/$1',
    '^reducers/(.*)': '<rootDir>/app/reducers/$1',
    '^routes/(.*)': '<rootDir>/app/routes/$1',
    '^partials/(.*)': '<rootDir>/app/components/Partials/$1',
    '^services/(.*)': '<rootDir>/app/services/$1',
    '^utils/(.*)': '<rootDir>/app/utils/$1',
    '^views/(.*)': '<rootDir>/app/views/$1'
  }
}
