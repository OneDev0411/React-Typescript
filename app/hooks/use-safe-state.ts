import { Dispatch, SetStateAction, useState } from 'react'

import useSafeDispatch from './use-safe-dispatch'

type InitialState<S> = S | (() => S)
type UseStateReturn1<S> = [S, Dispatch<SetStateAction<S>>]
type UseStateReturn2<S> = [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
]

/**
 * A wrapper on useState to make sure the state is updatable only when
 * the component is still mounted.
 *
 * This is useful when you want to ensure the setter function does not
 * throw an error if the component was unmounted.
 * @param dispatch target function
 */
function useSafeState<S>(initialState: InitialState<S>): UseStateReturn1<S>
function useSafeState<S = undefined>(): UseStateReturn2<S>
function useSafeState<S>(
  initialState?: InitialState<S>
): UseStateReturn1<S> | UseStateReturn2<S> {
  const [value, setValue] = useState(initialState)

  return [value, useSafeDispatch(setValue)]
}

export default useSafeState
