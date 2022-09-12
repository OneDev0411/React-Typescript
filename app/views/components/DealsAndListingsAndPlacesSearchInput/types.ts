export type SearchResultType = 'place' | 'listing' | 'deal'

interface BaseSearchResult<T extends SearchResultType> {
  type: T
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

export type SearchResult = PlaceResult | ListingResult | DealResult
