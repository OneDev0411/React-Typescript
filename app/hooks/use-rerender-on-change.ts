import { useEffect, useState } from 'react'
import usePrevious from 'react-use/lib/usePrevious'

export function useRerenderOnChange(value: any): true | null {
  const [shouldRender, setShouldRender] = useState(true)
  const previousValue = usePrevious(value)

  useEffect(() => {
    if (value !== previousValue && previousValue !== undefined) {
      setShouldRender(false)

      setTimeout(() => {
        setShouldRender(true)
      })
    }
  }, [value, previousValue])

  return shouldRender || null
}
