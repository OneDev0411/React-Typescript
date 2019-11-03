import { merge } from 'lodash'

/**
 * Given a list functions which return an object or undefined,
 * returns a new function that applies all of them and merges all
 * non-undefined values and returns the result
 */
export function mergeFunctions<
  Args extends Array<any>,
  R extends object | undefined
>(
  ...fns: ((...args: Args) => R | null | undefined)[]
): (...args: Args) => R | undefined {
  return (...args: Args) => {
    return fns.reduce((resultSoFar, fn) => {
      const result = fn(...args)

      return result != null
        ? merge({ ...(resultSoFar || {}) }, result)
        : resultSoFar
    }, undefined)
  }
}
