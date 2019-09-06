declare interface IBrandEmail {
  id: UUID
  created_at: number
  updated_at: number
  deleted_at: number | null
  created_by: UUID
  brand: UUID
  name: string
  goal: string | null
  subject: string
  include_signature: boolean
  body: string
  type: 'brand_email'
}
