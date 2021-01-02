import { useRef, useReducer, useCallback, Reducer } from 'react'

import useSafeDispatch from './use-safe-dispatch'

interface ReducerStateBase<U> {
  status: 'idle' | 'pending' | 'resolved' | 'rejected'
  error: Nullable<U>
}

interface ReducerStateNullable<T, U> extends ReducerStateBase<U> {
  data: Nullable<T>
}

interface ReducerState<T, U> extends ReducerStateBase<U> {
  data: T
}

interface UseAsyncReturnTypeBase<T, U> {
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

type UseAsyncReturnTypeNullable<T, U> = UseAsyncReturnTypeBase<T, U> &
  ReducerStateNullable<T, U>

type UseAsyncReturnType<T, U> = UseAsyncReturnTypeBase<T, U> &
  ReducerState<T, U>

type InitialReducerState<T, U> = Partial<ReducerState<T, U>> &
  Pick<ReducerState<T, U>, 'data'>

const defaultInitialState: ReducerState<any, any> = {
  status: 'idle',
  data: null,
  error: null
}

/**
 * A helper hook to call and get data from async functions.
 * @param initialState
 */
function useAsync<T = unknown, U = unknown>(): UseAsyncReturnTypeNullable<T, U>
function useAsync<T = unknown, U = unknown>(
  initialState: InitialReducerState<T, U>
): UseAsyncReturnType<T, U>

function useAsync<T = unknown, U = unknown>(
  initialState?: InitialReducerState<T, U>
): UseAsyncReturnType<T, U> {
  const initialStateRef = useRef<ReducerState<T, U>>({
    ...defaultInitialState,
    ...initialState
  })

  const [{ status, data, error }, setState] = useReducer<
    Reducer<ReducerState<T, U>, Partial<ReducerState<T, U>>>
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
