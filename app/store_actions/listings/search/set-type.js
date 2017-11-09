import * as types from '../../../constants/listings/search'

export const resetSearchType = () => ({
  type: types.RESET_SEARCH_TYPE
})

export const searchByMapBounds = () => ({
  type: types.SEARCH_BY_MAP_BOUNDS
})

export const searchByMlsNumber = () => ({
  type: types.SEARCH_BY_MLS_NUMBER
})

export const searchByPostalCode = () => ({
  type: types.SEARCH_BY_POSTAL_CODE
})

export const searchByFiltersAreas = () => ({
  type: types.SEARCH_BY_FILTERS_AREAS
})

export const setSearchType = type => ({ type })

export const reset = () => dispatch =>
  Promise.resolve(
    setTimeout(() => {
      dispatch(resetSearchType())
    }, 333)
  )
