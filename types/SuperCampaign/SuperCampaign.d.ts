declare type ISuperCampaignAssociations = 'template_instance'

declare interface ISuperCampaign<A extends ISuperCampaignAssociations = ''>
  extends IModel<'super_campaign'> {
  created_by: UUID
  brand: UUID
  due_at?: number
  executed_at?: number
  subject?: string
  description?: string
  template_instance: A extends 'template_instance'
    ? IMarketingTemplateInstance
    : UUID
  tags?: string[]
  eligible_brands: UUID[]
}
