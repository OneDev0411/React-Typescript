import config from 'config'

// Autocomplete search component constanst
export const AUTOCOMPLETE_RADIUS_M = 100000
export const AUTOCOMPLETE_MINIMUM_LENGTH_FOR_SEARCH = 3
export const AUTOCOMPLETE_SEARCH_DEBOUNCE_TIME_MS = 500
export const AUTOCOMPLETE_LISTINGS_ITEM_LIMIT = 4

// Valert constanst
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

export const FILTERS_INITIAL_VALUES = {
  open_house: false,
  property_types: ['Residential'],
  listing_statuses: ['Active'],
  property_subtypes: Object.values(FILTER_PROPERTY_SUBTYPES)
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
