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

declare interface IAgent {
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

  user_id?: UUID
  office_id?: UUID
  profile_image_url: string | null
  cover_image_url: string | null
  phone_numbers: string[] | null
  emails?: string[]
  office?: IAgentOffice
}
