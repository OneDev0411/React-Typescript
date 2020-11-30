interface ListingAgent extends IModel<'agent'> {
  email: string
  mlsid: string
  fax: string | null
  full_name: string
  first_name: string
  last_name: string
  middle_name: string
  phone_number: string
  nar_number: string
  office_mui: number
  status: 'Active'
  office_mlsid: string
  work_phone: string
  generational_name: string | null
  matrix_unique_id: number
  mls: string
  user_id: UUID | null
  office_id: UUID
  profile_image_url: string | null
  cover_image_url: string | null
  secret_questions: string[]
}

interface Address extends IModel<'address'> {
  title: string
  subtitle: string
  street_number: string
  street_name: string
  city: string
  state: string
  state_code: string
  postal_code: string
  neighborhood: string
  street_suffix: string
  unit_number: string
  country: string
  country_code: string
  location_google: string
  matrix_unique_id: number
  geocoded: boolean
  geo_source: string
  partial_match_google: null
  county_or_parish: string
  direction: null
  street_dir_prefix: string
  street_dir_suffix: string
  street_number_searchable: string
  geo_source_formatted_address_google: string
  geocoded_google: boolean
  geocoded_bing: boolean
  location_bing: string
  geo_source_formatted_address_bing: string
  geo_confidence_google: string
  geo_confidence_bing: string
  location: ILocation
  approximate: boolean
  corrupted: boolean
  corrupted_google: boolean
  corrupted_bing: boolean
  mls: string
  full_address: string
  street_address: string
}

interface Property extends IModel<'property'> {
  bedroom_count: number
  bathroom_count: number
  address_id: UUID
  description: string
  square_meters: number
  matrix_unique_id: number
  property_type: string
  property_subtype: string
  lot_square_meters: number
  year_built: number
  exterior_features: string[]
  interior_features: string[]
  fireplace_features: string[]
  lot_features: string[]
  parking_features: string[]
  pool_features: string[]
  security_features: string[]
  parking_spaces_covered_total: number | null
  half_bathroom_count: number | null
  full_bathroom_count: number | null
  heating: string[]
  flooring: string[]
  utilities: string[]
  utilities_other: string[]
  architectural_style: string[]
  number_of_stories: number | null
  number_of_parking_spaces: number | null
  garage_length: number | null
  garage_width: number | null
  number_of_dining_areas: number | null
  number_of_living_areas: number | null
  fireplaces_total: number | null
  lot_number: string
  soil_type: string
  construction_materials: string
  foundation_details: string
  roof: string
  pool_yn: boolean
  handicap_yn: boolean
  elementary_school_name: string
  intermediate_school_name: string
  high_school_name: string
  junior_high_school_name: string
  middle_school_name: string
  primary_school_name: string
  senior_high_school_name: string
  school_district: string
  subdivision_name: string
  appliances_yn: false
  green_building_certification: string
  green_energy_efficient: string
  lot_size: number | null
  lot_size_area: number | null
  lot_size_dimensions: string
  number_of_pets_allowed: number | null
  number_of_units: number | null
  pets_yn: boolean
  furnished_yn: boolean
  fenced_yard_yn: boolean
  block: string
  mls: string
  address: Address
}

interface ProposedAgent extends IModel<'user'> {
  username: string | null
  first_name: string
  last_name: string
  email: string
  phone_number: string
  address_id: UUID | null
  cover_image_url: string
  profile_image_url: string
  user_status: 'Active'
  profile_image_thumbnail_url: string | null
  cover_image_thumbnail_url: string | null
  email_confirmed: boolean
  timezone: string
  user_type: 'Agent' | 'Client'
  phone_confirmed: boolean
  agent: ListingAgent
}

declare type IListingAssociation = 'proposed_agent'

declare type IListing<Associations extends IListingAssociation = ''> = {
  type: 'listing'
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number | null
  property_id: UUID
  price: number
  matrix_unique_id: number
  original_price: number
  last_price: number | null
  status: IListingStatus
  association_fee: number | null
  mls_number: string
  association_fee_frequency: string
  association_fee_includes: string
  unexempt_taxes: number | null
  financing_proposed: string
  list_office_mui: string
  list_office_mls_id: string
  list_office_name: string
  list_office_phone: string
  possession: string
  co_list_office_mui: string
  co_list_office_mls_id: string
  co_list_office_name: string
  co_list_office_phone: string
  selling_office_mui: string
  selling_office_mls_id: string
  selling_office_name: string
  selling_office_phone: string
  co_selling_office_mui: string
  co_selling_office_mls_id: string
  co_selling_office_name: string
  co_selling_office_phone: string
  list_agent_mui: string
  list_agent_direct_work_phone: string
  list_agent_email: string
  list_agent_full_name: string
  list_agent_mls_id: string
  co_list_agent_mui: string
  co_list_agent_direct_work_phone: string
  co_list_agent_email: string
  co_list_agent_full_name: string
  co_list_agent_mls_id: string
  selling_agent_mui: string
  selling_agent_direct_work_phone: string
  selling_agent_email: string
  selling_agent_full_name: string
  selling_agent_mls_id: string
  co_selling_agent_mui: string
  co_selling_agent_direct_work_phone: string
  co_selling_agent_email: string
  co_selling_agent_full_name: string
  co_selling_agent_mls_id: string
  listing_agreement: string
  mls_area_major: string
  mls_area_minor: string
  mls_name: string
  matrix_modified_dt: string
  showing_instructions_type: string
  tax_legal_description: string
  keybox_type: string
  keybox_number: string
  close_date: number | null
  close_price: number | null
  dom: number | null
  cdom: number | null
  buyers_agency_commission: string
  sub_agency_commission: string
  list_date: number
  showing_instructions: string
  appointment_phone: string
  appointment_phone_ext: string
  appointment_call: string
  occupancy: string
  private_remarks: string
  photos_checked_at: null
  application_fee_yn: null
  revision: number
  mls: string
  transaction_type: string
  usage_type: string
  structure_type: string
  original_mls_property_type: string | null
  original_mls_property_subtype: string | null
  original_mls_status: string | null
  list_agent: ListingAgent
  favorited: boolean
  gallery_image_urls: null | string[]
  cover_image_url: null | string
  open_houses: boolean | null
  property: Property
  user_listing_notification_setting: null
} & Association<'proposed_agent', ProposedAgent, Associations>
