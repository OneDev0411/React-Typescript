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

export const removeListing = (id: UUID) => ({
  type: 'REMOVE_LISTING' as 'REMOVE_LISTING',
  payload: {
    id
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

export type Actions = ReturnType<
  | typeof setListings
  | typeof removeListing
  | typeof setMapLocation
  | typeof setIsLoading
>
