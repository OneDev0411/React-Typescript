// jest.config.js
module.exports = {
  roots: ['<rootDir>/app/', '<rootDir>/tests/unit'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testURL: 'http://localhost:8080',
  setupFilesAfterEnv: ['./setupTests.js'],
  verbose: true,
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
    '^views/(.*)': '<rootDir>/app/views/$1',
    '^store/(.*)': '<rootDir>/app/stores/$1',
    '^config$': '<rootDir>/config/public',
    '^fixtures/(.*)': '<rootDir>/tests/unit/fixtures/$1',
    '^hooks/(.*)': '<rootDir>/app/hooks/$1',
    '^animations/(.*)': '<rootDir>/app/animations/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/unit/mocks/styles.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/tests/unit/mocks/files.js'
  }
}
