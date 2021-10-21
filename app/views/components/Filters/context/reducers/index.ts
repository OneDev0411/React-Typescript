import { Actions } from '../actions'

export function reducer<T>(state: T, action: Actions<T>): T {
  switch (action.type) {
    case 'SET_FILTERS': {
      const { filters } = action.payload

      return { ...filters }
    }

    case 'RESET_FILTERS': {
      const { systemDefaultFilters } = action.payload

      return { ...systemDefaultFilters }
    }

    case 'UPDATE_FILTERS': {
      const { newFilters } = action.payload

      return { ...state, ...newFilters }
    }

    default:
      return state
  }
}
