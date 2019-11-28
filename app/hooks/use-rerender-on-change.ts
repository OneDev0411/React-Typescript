import { useEffect, useState } from 'react'
import usePrevious from 'react-use/lib/usePrevious'

export function useRerenderOnChange<T>(
  value: T,
  isEqualFn: (a: T, b: T) => boolean = (a, b) => a === b
): true | null {
  const [shouldRender, setShouldRender] = useState(true)
  const previousValue = usePrevious(value)

  useEffect(() => {
    if (previousValue !== undefined && !isEqualFn(value, previousValue)) {
      setShouldRender(false)

      setTimeout(() => {
        setShouldRender(true)
      })
    }
  }, [value, previousValue, isEqualFn])

  return shouldRender || null
}
