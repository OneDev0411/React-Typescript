import { useState } from 'react'

/**
 * Maintains a dictionary of key values, and exposes get and put functions
 * to read/write from/to the dictionary.
 */
export function useDictionary<T>() {
  const [dict, setDict] = useState<Record<string, T>>({})

  const put = (key: string, value: T) => {
    setDict(values => ({ ...values, [key]: value }))
  }

  const get = (key: string) => dict[key]

  return [get, put, setDict] as [
    typeof get,
    typeof put,
    typeof setDict
  ] /* enforce return type to be tuple instead of an array of the union of
  the element types */
}
