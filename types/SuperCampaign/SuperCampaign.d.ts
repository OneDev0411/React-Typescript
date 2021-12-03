declare type ISuperCampaignAssociations =
  | 'template_instance'
  | 'created_by'
  | 'template_instance_and_created_by'

declare interface ISuperCampaign<A extends ISuperCampaignAssociations = ''>
  extends IModel<'super_campaign'> {
  created_by: A extends 'created_by' | 'template_instance_and_created_by'
    ? IUser
    : UUID
  brand: UUID
  due_at?: number
  executed_at?: number
  subject?: string
  description?: string
  template_instance?: A extends
    | 'template_instance'
    | 'template_instance_and_created_by'
    ? IMarketingTemplateInstance
    : UUID
  tags: Nullable<string[]>
  eligible_brands: Nullable<UUID[]>
}
