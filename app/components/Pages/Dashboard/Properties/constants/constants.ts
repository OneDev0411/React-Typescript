import config from 'config'

// Autocomplete search component constanst
export const AUTOCOMPLETE_RADIUS_M = 100000
export const AUTOCOMPLETE_MINIMUM_LENGTH_FOR_SEARCH = 3
export const AUTOCOMPLETE_SEARCH_DEBOUNCE_TIME_MS = 500
export const AUTOCOMPLETE_LISTINGS_ITEM_LIMIT = 4

// Valert constanst
export const SEARCH_DEBOUNCE_MS = 300
export const PROPOSED_AGENT_ZOOM_LEVEL = 16
export const PAGE_SIZE = 30

// Map constants
export const MINIMAL_MARKER_ZOOM_LEVEL = 8
export const QUERY_LIMIT = 200
export const bootstrapURLKeys = {
  key: config.google.api_key,
  libraries: ['drawing', 'places', 'geometry'].join(',')
}
// TODO: Remove this const after refactoring fav/saved tab
export const mapInitialState = {
  zoom: 5,
  center: {
    // United States Center
    lat: 37.2755783,
    lng: -104.6571311
  },
  size: null,
  bounds: null
}

// Filters constants
export const STATUSES = {
  sold: 'Sold',
  active: 'Active',
  pending: 'Pending',
  other: 'Other Listing Statuses'
}

export const PENDING_STATUSES = {
  pending: 'Pending',
  active_kick_out: 'Active Kick Out',
  active_contingent: 'Active Contingent',
  active_option_contract: 'Active Option Contract'
}

export const OTHER_STATUSES = {
  expired: 'Expired',
  cancelled: 'Cancelled',
  withdrawn: 'Withdrawn',
  temp_off_market: 'Temp Off Market',
  withdrawn_sublistin: 'Withdrawn Sublisting'
}

export const FILTER_PROPERTY_SUBTYPES = {
  condo: 'RES-Condo',
  farm: 'RES-Farm/Ranch',
  duplex: 'RES-Half Duplex',
  townhouse: 'RES-Townhouse',
  single_family: 'RES-Single Family'
}

export const FILTERS_INITIAL_VALUES: AlertFilters = {
  open_house: false,
  property_types: ['Residential'],
  listing_statuses: ['Active'] as IListingStatus[],
  property_subtypes: Object.values(
    FILTER_PROPERTY_SUBTYPES
  ) as IPropertySubtype[],
  minimum_price: null,
  maximum_price: null,
  minimum_bedrooms: null,
  maximum_bedrooms: null,
  minimum_bathrooms: null,
  maximum_bathrooms: null,
  minimum_square_meters: null,
  maximum_square_meters: null,
  created_by: null,
  minimum_lot_square_meters: null,
  maximum_lot_square_meters: null,
  minimum_year_built: null,
  maximum_year_built: null,
  pool: null,
  pets: null,
  number_of_pets_allowed: null,
  application_fee: null,
  appliances: null,
  furnished: null,
  fenced_yard: null,
  title: null,
  minimum_sold_date: null,
  excluded_listing_ids: null,
  mls_areas: null,
  postal_codes: null,
  search: null
}

// TODO: Refactor this after refactoring Filters component
export const ARCHITECTURAL_STYLES = {
  southwestern: 'Southwestern',
  ranch: 'Ranch',
  spanish: 'Spanish',
  aFrame: 'A-Frame',
  midCentry_modern: 'Mid-Centry Modern',
  prairie: 'Prairie',
  studio_apartment: 'Studio Apartment',
  contemporary: 'Contemporary/Modern',
  split_level: 'Split Level',
  victorian: 'Victorian',
  traditional: 'Traditional',
  mediterranean: 'Mediterranean',
  colonial: 'Colonial',
  oriental: 'Oriental',
  loft: 'Loft',
  french: 'French',
  tudor: 'Tudor'
}
