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

export const PENDING_STATUSES: Record<string, IListingStatus> = {
  pending: 'Pending',
  active_kick_out: 'Active Kick Out',
  active_contingent: 'Active Contingent',
  active_option_contract: 'Active Option Contract'
}

export const OTHER_STATUSES: Record<string, IListingStatus> = {
  expired: 'Expired',
  cancelled: 'Cancelled',
  withdrawn: 'Withdrawn',
  temp_off_market: 'Temp Off Market',
  withdrawn_sublistin: 'Withdrawn Sublisting'
}

export const RES_FILTER_PROPERTY_SUBTYPES: Record<string, IPropertySubtype> = {
  condo: 'RES-Condo',
  farm: 'RES-Farm/Ranch',
  duplex: 'RES-Half Duplex',
  townhouse: 'RES-Townhouse',
  single_family: 'RES-Single Family'
}

export const LND_FILTER_PROPERTY_SUBTYPES: Record<string, IPropertySubtype> = {
  commercial: 'LND-Commercial',
  farm: 'LND-Farm/Ranch',
  residential: 'LND-Residential'
}

export const MUL_FILTER_PROPERTY_SUBTYPES: Record<string, IPropertySubtype> = {
  single: 'MUL-Multiple Single Units',
  apartment: 'MUL-Apartment/5Plex+',
  duplex: 'MUL-Full Duplex',
  triplex: 'MUL-Triplex',
  fourplex: 'MUL-Fourplex'
}

export const LSE_FILTER_PROPERTY_SUBTYPES: Record<string, IPropertySubtype> = {
  apartment: 'LSE-Apartment',
  House: 'LSE-House',
  townhome: 'LSE-Condo/Townhome',
  duplex: 'LSE-Duplex',
  Triplex: 'LSE-Triplex',
  fourplex: 'LSE-Fourplex',
  Mobile: 'LSE-Mobile'
}

export const COM_FILTER_PROPERTY_SUBTYPES: Record<string, IPropertySubtype> = {
  lease: 'COM-Lease',
  sale: 'COM-Sale',
  either: 'COM-Sale or Lease (Either)',
  both: 'COM-Sale/Leaseback (Both)'
}

export const PROPERTY_TYPES: Record<IPropertyType, string> = {
  Residential: 'Sale',
  'Residential Lease': 'Lease',
  Commercial: 'Commercial',
  'Lots & Acreage': 'Lots & Acreage',
  'Multi-Family': 'Multi Family'
}

export const PROPERTY_TYPES_PROPERTY_SUBTYPES: Record<
  IPropertyType,
  Record<string, IPropertySubtype>
> = {
  Residential: RES_FILTER_PROPERTY_SUBTYPES,
  'Residential Lease': LSE_FILTER_PROPERTY_SUBTYPES,
  Commercial: COM_FILTER_PROPERTY_SUBTYPES,
  'Lots & Acreage': LND_FILTER_PROPERTY_SUBTYPES,
  'Multi-Family': MUL_FILTER_PROPERTY_SUBTYPES
}

export const FILTERS_INITIAL_VALUES: AlertFilters = {
  open_house: false,
  property_types: ['Residential'],
  property_subtypes: Object.values(
    RES_FILTER_PROPERTY_SUBTYPES
  ) as IPropertySubtype[],
  listing_statuses: ['Active'] as IListingStatus[],
  architectural_styles: null,
  school_districts: null,
  elementary_schools: null,
  high_schools: null,
  middle_schools: null,
  junior_high_schools: null,
  senior_high_schools: null,
  primary_schools: null,
  intermediate_schools: null,
  minimum_parking_spaces: null,
  mls_areas: null,
  counties: null,
  subdivisions: null,
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
  postal_codes: null,
  search: null
}

export const RES_FILTERS_DEFAULT_VALUES: AlertFilters = {
  ...FILTERS_INITIAL_VALUES
}

export const LSE_FILTERS_DEFAULT_VALUES: AlertFilters = {
  ...FILTERS_INITIAL_VALUES,
  property_types: ['Residential Lease'],
  property_subtypes: Object.values(
    LSE_FILTER_PROPERTY_SUBTYPES
  ) as IPropertySubtype[]
}

export const LND_FILTERS_DEFAULT_VALUES: AlertFilters = {
  ...FILTERS_INITIAL_VALUES,
  property_types: ['Lots & Acreage'],
  property_subtypes: Object.values(
    LND_FILTER_PROPERTY_SUBTYPES
  ) as IPropertySubtype[]
}

export const MUL_FILTERS_DEFAULT_VALUES: AlertFilters = {
  ...FILTERS_INITIAL_VALUES,
  property_types: ['Multi-Family'],
  property_subtypes: Object.values(
    MUL_FILTER_PROPERTY_SUBTYPES
  ) as IPropertySubtype[]
}

export const COM_FILTERS_DEFAULT_VALUES: AlertFilters = {
  ...FILTERS_INITIAL_VALUES,
  property_types: ['Commercial'],
  property_subtypes: Object.values(
    COM_FILTER_PROPERTY_SUBTYPES
  ) as IPropertySubtype[]
}

export const PROPERTY_TYPES_DEFAULT_VALUES: Record<
  IPropertyType,
  AlertFilters
> = {
  Residential: RES_FILTERS_DEFAULT_VALUES,
  'Residential Lease': LSE_FILTERS_DEFAULT_VALUES,
  Commercial: LND_FILTERS_DEFAULT_VALUES,
  'Lots & Acreage': MUL_FILTERS_DEFAULT_VALUES,
  'Multi-Family': COM_FILTERS_DEFAULT_VALUES
}

export const ARCHITECTURAL_STYLES: Record<string, IArchitecturalStyle> = {
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

export const SCHOOL_TYPES: Record<SchoolType, string> = {
  junior_high_school: 'junior high school',
  elementary_school: 'elementary school',
  high_school: 'high school',
  middle_school: 'middle school',
  intermediate_school: 'intermediate school',
  senior_high_school: 'senior high school',
  primary_school: 'primary school'
}
