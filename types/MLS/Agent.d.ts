declare interface IAgent {
  id: UUID

  email: string
  mlsid: string
  fax: string
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
  generational_name: string
  matrix_unique_id: number
  matrix_modified_dt: number
  updated_at: number
  deleted_at?: number
  created_at: number

  user_id?: UUID
  office_id?: UUID
  profile_image_url?: string
  cover_image_url?: string
  phone_numbers?: string[]
  emails?: string[]
}
