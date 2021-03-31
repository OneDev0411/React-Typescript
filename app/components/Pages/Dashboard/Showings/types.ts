export type ShowingTabType = 'Overview' | 'All' | 'Offline'

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

export type ShowingRolePerson = Pick<
  IShowingRole,
  'first_name' | 'last_name' | 'email' | 'phone_number'
>
