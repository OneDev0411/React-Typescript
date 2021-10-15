declare interface ISuperCampaignInput {
  due_at?: number
  subject?: string
  description?: string
  template_instance?: UUID
  tags?: string[]
  eligible_brands?: UUID[]
}
