export const setFilters = <T>(filters: T) => ({
  type: 'SET_FILTERS' as 'SET_FILTERS',
  payload: {
    filters
  }
})

export const resetFilters = <T>(systemDefaultFilters: T) => ({
  type: 'RESET_FILTERS' as 'RESET_FILTERS',
  payload: {
    systemDefaultFilters
  }
})

export const updateFilters = <T>(newFilters: Partial<T>) => ({
  type: 'UPDATE_FILTERS' as 'UPDATE_FILTERS',
  payload: {
    newFilters
  }
})

class Wrapper<T extends unknown> {
  setFilters = (args: any) => setFilters<T>(args)

  resetFilters = (args: any) => resetFilters<T>(args)

  updateFilters = (args: any) => updateFilters<T>(args)
}

// TODO: Find better way return type for generics actions
export type Actions<T extends unknown> = ReturnType<
  Wrapper<T>['setFilters' | 'resetFilters' | 'updateFilters']
>
