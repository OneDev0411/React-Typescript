declare interface ISuperCampaignInput {
  subject: string
  description: string
  template: UUID
  due_at: number
  recipients: ISuperCampaignRecipientInput[]
}
