declare type ISuperCampaignAssociations = 'template_instance'

declare interface ISuperCampaign<A extends ISuperCampaignAssociations = ''>
  extends IModel<'super_campaign'> {
  brand: UUID
  created_by: UUID
  executed_at: null
  recipients: null
  subject: string
  template_instance: A extends 'template_instance'
    ? IMarketingTemplateInstance
    : UUID
  subject: string
  description: string
  due_at: number
  eligible_brands: null
  tags: null
  // TODO: complete this type
}
