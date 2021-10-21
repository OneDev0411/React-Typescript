import { useMemo } from 'react'

import matchSorter from 'match-sorter'

export function useMatchSorter<T>(
  list: T[],
  searchValue: string,
  keys: string[]
): T[] {
  const result = useMemo(() => {
    return searchValue
      ? matchSorter(list, searchValue, {
          keys
        })
      : list
  }, [list, searchValue, keys])

  return result
}
