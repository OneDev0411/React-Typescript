export type ShowingDetailTabType =
  | 'Bookings'
  | 'Visitors'
  | 'Feedback'
  | 'Settings'

export type ShowingsTabType = 'Properties' | 'Bookings'

export type GooglePlace = google.maps.GeocoderResult

export interface ShowingPropertyBase<T extends string> {
  type: T
}

export interface ShowingPropertyPlace extends ShowingPropertyBase<'place'> {
  address: IStdAddr
  gallery: IMediaGallery
  price: number
}

export interface ShowingPropertyListing extends ShowingPropertyBase<'listing'> {
  listing: ICompactListing
}

export interface ShowingPropertyDeal extends ShowingPropertyBase<'deal'> {
  deal: IDeal
}

export type ShowingPropertyType =
  | ShowingPropertyDeal
  | ShowingPropertyListing
  | ShowingPropertyPlace
