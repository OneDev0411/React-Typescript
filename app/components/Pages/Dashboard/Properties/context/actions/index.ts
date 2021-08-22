export const setListings = (listings: ICompactListing[]) => ({
  type: 'SET_LISTINGS' as 'SET_LISTINGS',
  payload: {
    listings
  }
})

export const toggleListingHoverState = (id: UUID) => ({
  type: 'TOGGLE_LISTING_HOVER_STATE' as 'TOGGLE_LISTING_HOVER_STATE',
  payload: {
    id
  }
})

export const toggleListingClickedState = (id: UUID) => ({
  type: 'TOGGLE_LISTING_CLICKED_STATE' as 'TOGGLE_LISTING_CLICKED_STATE',
  payload: {
    id
  }
})

export const setOffAllClickedStates = () => ({
  type: 'SET_OFF_ALL_CLICKED_STATES' as 'SET_OFF_ALL_CLICKED_STATES',
  payload: {}
})

export const setMapDrawing = (points: IPoint[]) => ({
  type: 'SET_MAP_DRAWING' as 'SET_MAP_DRAWING',
  payload: {
    points
  }
})

export const setMapBounds = (ne: number, sw: number) => ({
  type: 'SET_MAP_BOUNDS' as 'SET_MAP_BOUNDS',
  payload: {
    ne,
    sw
  }
})

export const setMapProps = (center: IPoint, zoom: number) => ({
  type: 'SET_MAP_PROPS' as 'SET_MAP_PROPS',
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
  | typeof toggleListingHoverState
  | typeof toggleListingClickedState
  | typeof setOffAllClickedStates
  | typeof setMapDrawing
  | typeof setMapBounds
  | typeof setMapProps
  | typeof setIsLoading
  | typeof removeMapDrawing
>
