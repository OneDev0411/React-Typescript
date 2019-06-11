const { resolve } = require('path')

module.exports = {
  rootDir: resolve('tests/e2e'),
  verbose: true,
  setupFilesAfterEnv: ['./jest.setup.js'],
  preset: 'ts-jest/presets/default',
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
