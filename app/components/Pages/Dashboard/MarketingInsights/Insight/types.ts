export interface ContactStatType {
  unsubscribed: number
  failed: number
  opened: number
  clicked: number
}

export interface ContactsListType extends ContactStatType {
  id: UUID
  display_name: string | null
  profile_image_url: string | null
  to: string
  original_data: IInsightEmail
}
