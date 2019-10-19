/**
 * Given a list of functions with similar signature which can return a value
 * or undefined|null, it returns a wrapper function which calls those
 * functions in turn until it receives a value from them which is not null or
 * undefined and it returns that value
 */
export function combine<Args extends Array<any>, R>(
  ...fns: ((...args: Args) => R | null | undefined)[]
) {
  return (...args: Args) => {
    let result

    fns.some(fn => {
      result = fn(...args)

      return result != null
    })

    return result
  }
}
