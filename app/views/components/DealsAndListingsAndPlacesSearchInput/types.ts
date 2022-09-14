export type SearchResultType = 'place' | 'location' | 'listing' | 'deal'

interface BaseSearchResult<T extends SearchResultType> {
  type: T
}

export interface LocationResult extends BaseSearchResult<'location'> {
  location: google.maps.GeocoderResult
}

export interface PlaceResult extends BaseSearchResult<'place'> {
  place: google.maps.places.AutocompletePrediction
}

export interface ListingResult extends BaseSearchResult<'listing'> {
  listing: ICompactListing
}

export interface DealResult extends BaseSearchResult<'deal'> {
  deal: IDeal
}

export type SearchResult =
  | LocationResult
  | PlaceResult
  | ListingResult
  | DealResult
