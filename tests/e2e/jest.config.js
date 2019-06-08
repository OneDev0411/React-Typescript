const { resolve } = require('path')

module.exports = {
  rootDir: resolve('tests/e2e'),
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
