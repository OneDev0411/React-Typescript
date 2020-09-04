export interface EmailStatType {
  unsubscribed: number
  failed: number
  opened: number
  clicked: number
}

export interface ContactsListType extends EmailStatType {
  id: UUID
  display_name: string | null
  profile_image_url: string | null
  to: string
  original_data: IEmailCampaignEmail
  contact: UUID | null
  error: string | null
}
