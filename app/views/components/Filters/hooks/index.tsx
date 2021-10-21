import { useContext } from 'react'

import { FiltersContext } from '../context'
import { Actions } from '../context/actions'

export type FilterContext<T> = [T, (action: Actions<T>) => void]

export default function useFiltersContext<T>() {
  const context = useContext(FiltersContext)

  if (typeof context === 'undefined') {
    throw new Error(
      'useFiltersContext must be used within a FiltersContext.Provider'
    )
  }

  return context as FilterContext<T>
}
