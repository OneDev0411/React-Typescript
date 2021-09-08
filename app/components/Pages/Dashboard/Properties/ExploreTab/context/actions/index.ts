export const setListings = (
  listings: ICompactListing[],
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

export const setMapBounds = (
  center: ICoord,
  zoom: number,
  bounds: IBounds
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

export type Actions = ReturnType<
  | typeof setListings
  | typeof changeListingHoverState
  | typeof changeListingClickedState
  | typeof toggleListingFavoriteState
  | typeof setMapDrawing
  | typeof setMapBounds
  | typeof setMapLocation
  | typeof setIsLoading
  | typeof removeMapDrawing
>
