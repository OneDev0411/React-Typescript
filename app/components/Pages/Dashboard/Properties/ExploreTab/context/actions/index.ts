import { Sort, IFormattedCompactListing } from '../../../types'

export const setListings = (
  listings: IFormattedCompactListing[],
  info: ICompactListingInfo
) => ({
  type: 'SET_LISTINGS' as 'SET_LISTINGS',
  payload: {
    listings,
    info
  }
})

export const changeListingHoverState = (id: Nullable<UUID>) => ({
  type: 'CHANGE_LISTING_HOVER_STATE' as 'CHANGE_LISTING_HOVER_STATE',
  payload: {
    id
  }
})

export const changeListingClickedState = (id: Nullable<UUID>) => ({
  type: 'CHANGE_LISTING_CLICKED_STATE' as 'CHANGE_LISTING_CLICKED_STATE',
  payload: {
    id
  }
})

export const toggleListingFavoriteState = (id: UUID) => ({
  type: 'TOGGLE_LISTING_FAVORITE_STATE' as 'TOGGLE_LISTING_FAVORITE_STATE',
  payload: {
    id
  }
})

export const setMapDrawing = (points: ICoord[]) => ({
  type: 'SET_MAP_DRAWING' as 'SET_MAP_DRAWING',
  payload: {
    points
  }
})

export const updateFilters = (filters: Partial<AlertFilters>) => ({
  type: 'UPDATE_FILTERS' as 'UPDATE_FILTERS',
  payload: { filters }
})

export const changeSort = (sort: Sort) => ({
  type: 'CHANGE_SORT' as 'CHANGE_SORT',
  payload: { sort }
})

export const setMapBounds = (
  center: ICoord,
  zoom: number,
  bounds: ICompactBounds
) => ({
  type: 'SET_MAP_BOUNDS' as 'SET_MAP_BOUNDS',
  payload: {
    center,
    zoom,
    bounds
  }
})

export const setMapLocation = (center: ICoord, zoom: number) => ({
  type: 'SET_MAP_LOCATION' as 'SET_MAP_LOCATION',
  payload: {
    center,
    zoom
  }
})

export const setIsLoading = (isLoading: boolean) => ({
  type: 'SET_IS_LOADING' as 'SET_IS_LOADING',
  payload: {
    isLoading
  }
})

export const removeMapDrawing = () => ({
  type: 'REMOVE_MAP_DRAWING' as 'REMOVE_MAP_DRAWING',
  payload: {}
})

export const clearListingUiStates = () => ({
  type: 'CLEAR_LISTING_UI_STATES' as 'CLEAR_LISTING_UI_STATES',
  payload: {}
})

export type Actions = ReturnType<
  | typeof setListings
  | typeof changeListingHoverState
  | typeof changeListingClickedState
  | typeof toggleListingFavoriteState
  | typeof setMapDrawing
  | typeof setMapBounds
  | typeof updateFilters
  | typeof changeSort
  | typeof setMapLocation
  | typeof setIsLoading
  | typeof removeMapDrawing
  | typeof clearListingUiStates
>
