declare interface ICompactAddress {
  street_number: string
  street_name: string
  street_address: string
  city: string
  state: string
  postal_code: string
  neighborhood: string
  street_suffix: string
  unit_number: string
  country: string
  country_code: string
  street_dir_prefix: string
  street_dir_suffix: string
  created_at: number
  updated_at: number
  type: 'compact_address'
}

declare interface ICompactProperty {
  property_type: string
  property_subtype: string
  half_bathroom_count: number
  full_bathroom_count: number
  square_meters: number
  bedroom_count: number | null
  bathroom_count: number | null
  year_built: number
  number_of_units: null
  lot_size_dimensions: string
  lot_square_meters: number
  lot_size_area: number
  description: string
  created_at: number
  updated_at: number
  type: 'compact_property'
}

declare interface ICompactListing extends IModel<'compact_listing'> {
  close_date: number | null
  price: number
  close_price: number | null
  status: IListingStatus
  mls_number: string
  buyers_agency_commission: string
  sub_agency_commission: string
  list_office_name: string
  selling_office_name: string
  list_agent_mls_id: string
  list_agent_email: string
  list_agent_full_name: string
  list_agent_direct_work_phone: string
  co_list_agent_mls_id: string
  selling_agent_mls_id: string
  selling_agent_email: string
  selling_agent_full_name: string
  selling_agent_direct_work_phone: string
  co_selling_agent_mls_id: string
  favorited: boolean
  location: ILocation
  cover_image_url: string
  gallery_image_urls: null | string[]
  address: ICompactAddress
  open_houses: boolean | null
  compact_property: ICompactProperty
  user_listing_notification_setting: null
  dom: number | null
}
