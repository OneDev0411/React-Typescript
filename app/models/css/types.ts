export interface CSSInput {
  username: string
  password: string
  selected_location: string
  selected_location_string: string
}

export interface CSSData {
  id: UUID
  user: UUID
  brand: UUID
  username: string
  last_crawled_at: number
  login_status: boolean
  selected_location: string
  selected_location_string: string
  type: string
}
