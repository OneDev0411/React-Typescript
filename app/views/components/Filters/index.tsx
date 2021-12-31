import { useReducer, useMemo } from 'react'

import { FiltersContext } from './context'
import {
  resetFilters as resetFiltersAction,
  updateFilters as updateFiltersAction
} from './context/actions'
import { reducer } from './context/reducers'
import { FilterContext } from './hooks'

interface Props<T> {
  children: (
    state: T,
    handleUpdateFilters: (filters: Partial<T>) => void,
    handleResetFilters: () => void,
    systemDefaultFilters: T,
    resultsCount?: number
  ) => React.ReactNode
  systemDefaultFilters: T
  userFilters: Partial<T>
  resultsCount?: number
  onChange: (filters: T) => void
}

export function Filters<T>({
  children,
  systemDefaultFilters,
  userFilters,
  resultsCount,
  onChange
}: Props<T>) {
  const [state, dispatch] = useReducer(reducer, {
    ...systemDefaultFilters,
    ...userFilters
  }) as FilterContext<T>

  // Inline value assignment to context (ie. value = {[state, value]}) is
  // a bad idea cause it results in unnecessary re-renders everytime the
  // Filters component re-renders and hence, child components also rerender
  const contextValue = useMemo(() => {
    return [state, dispatch]
  }, [state, dispatch])

  const handleResetFilters = () => {
    dispatch(resetFiltersAction(systemDefaultFilters))
    onChange({ ...systemDefaultFilters })
  }

  const handleUpdateFilters = (newFilters: Partial<T>) => {
    dispatch(updateFiltersAction(newFilters))
    onChange({ ...state, ...newFilters })
  }

  return (
    <FiltersContext.Provider value={contextValue}>
      {children(
        state,
        handleUpdateFilters,
        handleResetFilters,
        systemDefaultFilters,
        resultsCount
      )}
    </FiltersContext.Provider>
  )
}
