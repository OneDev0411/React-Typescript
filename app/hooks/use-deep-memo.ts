import { useRef } from 'react'
import usePrevious from 'react-use/lib/usePrevious'
import { isEqual } from 'lodash'

export function useDeepMemo(fn, deps) {
  const value = useRef<ReturnType<typeof fn> | null>(null)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prevDeps = deps.map(dep => usePrevious(dep))

  if (deps && deps.some((dep, index) => !isEqual(prevDeps[index], dep))) {
    value.current = fn()
  }

  return value.current
}
