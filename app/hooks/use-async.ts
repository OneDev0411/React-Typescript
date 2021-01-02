import { useRef, useReducer, useCallback, Reducer } from 'react'

import useSafeDispatch from './use-safe-dispatch'

interface ReducerState<T, U> {
  status: 'idle' | 'pending' | 'resolved' | 'rejected'
  data: Nullable<T>
  error: Nullable<U>
}

type InitialReducerState<T, U> = Partial<ReducerState<T, U>>

interface UseAsyncReturnType<T, U> extends ReducerState<T, U> {
  // using the same names that react-query uses for convenience
  isIdle: boolean
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  setData: (data: T) => void
  setError: (error: U) => void
  run: (func: () => Promise<T>) => void
  reset: () => void
}

const defaultInitialState: ReducerState<any, any> = {
  status: 'idle',
  data: null,
  error: null
}

/**
 * A helper hook to call and get data from async functions.
 * @param initialState
 */
function useAsync<T = unknown, U = unknown>(
  initialState: InitialReducerState<T, U> = {}
): UseAsyncReturnType<T, U> {
  const initialStateRef = useRef<ReducerState<T, U>>({
    ...defaultInitialState,
    ...initialState
  })

  const [{ status, data, error }, setState] = useReducer<
    Reducer<ReducerState<T, U>, InitialReducerState<T, U>>
  >((s, a) => ({ ...s, ...a }), initialStateRef.current)

  const safeSetState = useSafeDispatch(setState)

  const run = useCallback<(func: () => Promise<T>) => void>(
    func => {
      safeSetState({ status: 'pending' })

      return func().then(
        data => {
          safeSetState({ data, status: 'resolved' })

          return data
        },
        error => {
          safeSetState({ status: 'rejected', error })

          return error
        }
      )
    },
    [safeSetState]
  )

  const setData = useCallback((data: T) => safeSetState({ data }), [
    safeSetState
  ])
  const setError = useCallback((error: U) => safeSetState({ error }), [
    safeSetState
  ])
  const reset = useCallback(() => safeSetState(initialStateRef.current), [
    safeSetState
  ])

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',
    setData,
    setError,
    error,
    status,
    data,
    run,
    reset
  }
}

export default useAsync
