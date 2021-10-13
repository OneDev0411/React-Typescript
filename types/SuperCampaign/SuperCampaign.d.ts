declare interface ISuperCampaign extends IModel<'super_campaign'> {
  brand: UUID
  created_by: UUID
  executed_at: null
  recipients: null
  subject: string
  template_instance: null
  subject: string
  description: string
  due_at: number
  eligible_brands: null
  tags: null
  // TODO: complete this type
}
