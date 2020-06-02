import { dependencies, devDependencies } from '../../../package.json'

describe('package.json dependencies', () => {
  Object.entries({ ...dependencies, ...devDependencies }).map(
    ([key, value]) => {
      it(`${key} contains specified version`, () => {
        expect(value).toMatch(/\d+\.\d+\.\d+|#[0-f]+|github:.+/)
      })
    }
  )
})
