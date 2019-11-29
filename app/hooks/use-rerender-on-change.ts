import { useEffect, useState } from 'react'
import usePrevious from 'react-use/lib/usePrevious'

export function useRerenderOnChange<T>(
  value: T,
  isEqualFn: (a: T, b: T) => boolean = (a, b) => a === b
): true | null {
  const [, setRerendererState] = useState(true)
  const previousValue = usePrevious(value)

  const shouldRender =
    previousValue === undefined || isEqualFn(value, previousValue)

  useEffect(() => {
    if (!shouldRender) {
      setRerendererState(a => !a)
    }
  }, [shouldRender])

  return shouldRender || null
}
