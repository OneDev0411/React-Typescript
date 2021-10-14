declare interface ISuperCampaignInput {
  subject: string
  description: string
  template_instance: UUID
  due_at: number
  recipients: ISuperCampaignRecipientInput[]
}
