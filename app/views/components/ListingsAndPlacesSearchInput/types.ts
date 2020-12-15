export interface PlaceResult {
  type: 'place'
  place: google.maps.GeocoderResult
}

export interface ListingResult {
  type: 'listing'
  listing: ICompactListing
}

export type SearchResult = PlaceResult | ListingResult
