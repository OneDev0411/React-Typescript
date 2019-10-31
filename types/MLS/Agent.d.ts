declare interface IAgentOffice {
  id: UUID
  type: string
  mls_id: string
  name: string
  long_name: string
  address: string
  phone: string
  fax: string
  city: string
  state: string
  postal_code: string
  license_number: string
  email: string
}

declare interface IAgent extends IModel<'agent'> {
  id: UUID

  email: string | '' // seems sometime it's empty string! not null
  mlsid: string
  fax: string | null
  full_name: string
  first_name: string
  last_name: string
  middle_name: string
  phone_number: string
  nar_number: string
  office_mui: number
  status: string
  office_mlsid: string
  work_phone: string
  generational_name: string | null
  matrix_unique_id: number
  updated_at: number
  deleted_at: number | null
  created_at: number

  mls?: string
  user_id?: UUID
  office_id?: UUID
  profile_image_url: string | null
  cover_image_url: string | null
  phone_numbers?: string[] | null
  emails?: string[]
  office?: IAgentOffice | null
  secret_questions: string[]
}

/* using for those agents which selected from Deals -> Agent Network to promote a deal */
declare interface IDealAgent {
  id: UUID
  agentId: UUID
  name: string
  email: string
  phone: string
  company: string
  asBuyers: any[]
  asListing: any[]
  listings: any[]
  listingsAveragePrice: number
  listingsCount: number
  listingsTotalVolume: number
  soldListings: any[]
}
