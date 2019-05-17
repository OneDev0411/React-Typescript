const {resolve} = require('path')

module.exports = {
    rootDir: resolve('tests/e2e'),
    setupFilesAfterEnv: ['./jest.setup.js'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
}