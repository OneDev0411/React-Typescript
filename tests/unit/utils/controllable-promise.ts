export function controllablePromise() {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  return {
    promise,
    resolve,
    reject
  }
}

interface State {
  promise: Nullable<Promise<void>>
  resolve: Nullable<() => void>
  reject: Nullable<(ex: unknown) => void>
}

export function makeControlledAsync(mockFn) {
  const state: State = {
    promise: null,
    resolve: null,
    reject: null
  }

  function clear() {
    state.promise = null
    state.resolve = null
    state.reject = null
  }

  async function fn(...args) {
    Object.assign(state, controllablePromise())
    await state.promise

    mockFn(...args)
    clear()
  }

  function resolve() {
    if (!state.resolve) {
      throw new Error(
        'makeControlledAsync: resolve called before a promise was made'
      )
    }

    state.resolve()
  }

  function reject(ex: unknown) {
    if (!state.reject) {
      throw new Error(
        'makeControlledAsync: reject called before a promise was made'
      )
    }

    state.reject(ex)
  }

  return { fn, resolve, reject, mockFn }
}
