import {
  useRef,
  useReducer,
  useCallback,
  Reducer,
  Dispatch,
  SetStateAction
} from 'react'

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

type InitialReducerState<T, U> = Partial<ReducerState<T, U>> &
  Pick<ReducerState<T, U>, 'data'>

type ReducerAction<T, U> =
  | Partial<ReducerState<T, U>>
  | ((state: ReducerState<T, U>) => Partial<ReducerState<T, U>>)

interface UseAsyncReturnTypeBase<T, U> {
  // using the same names that react-query uses for convenience
  isIdle: boolean
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  setError: (error: U) => void
  run: (func: () => Promise<T>) => Promise<T>
  reset: () => void
}

export interface UseAsyncReturnTypeNullable<T, U = unknown>
  extends UseAsyncReturnTypeBase<T, U>,
    ReducerStateNullable<T, U> {
  setData: Dispatch<SetStateAction<Nullable<T>>>
}

export interface UseAsyncReturnType<T, U = unknown>
  extends UseAsyncReturnTypeBase<T, U>,
    ReducerState<T, U> {
  setData: Dispatch<SetStateAction<T>>
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
function useAsync<T = unknown, U = Error>(): UseAsyncReturnTypeNullable<T, U>
function useAsync<T = unknown, U = Error>(
  initialState: InitialReducerState<T, U>
): UseAsyncReturnType<T, U>

function useAsync<T = unknown, U = Error>(
  initialState?: InitialReducerState<T, U>
) {
  const initialStateRef = useRef<ReducerState<T, U>>({
    ...defaultInitialState,
    ...initialState
  })

  const [{ status, data, error }, setState] = useReducer<
    Reducer<ReducerState<T, U>, ReducerAction<T, U>>
  >(
    (s, a) => ({ ...s, ...(typeof a === 'function' ? a(s) : a) }),
    initialStateRef.current
  )

  const safeSetState = useSafeDispatch(setState)

  const run = useCallback<(func: () => Promise<T>) => Promise<T>>(
    func => {
      safeSetState({ status: 'pending' })

      return new Promise<T>((resolve, reject) => {
        func().then(
          data => {
            safeSetState({ data, status: 'resolved' })
            resolve(data)
          },
          error => {
            safeSetState({ status: 'rejected', error })

            reject(error)
          }
        )
      })
    },
    [safeSetState]
  )

  const setData = useCallback(
    (data: (s: T) => T) => {
      if (typeof data === 'function') {
        safeSetState(oldState => ({ data: data(oldState.data) }))
      } else {
        safeSetState({ data })
      }
    },
    [safeSetState]
  )
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
