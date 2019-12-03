import { useRef } from 'react'

export function useLatestValueRef<T>(value: T) {
  const valueRef = useRef<T>(value)

  valueRef.current = value

  return valueRef
}
