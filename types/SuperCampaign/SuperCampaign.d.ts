declare type ISuperCampaignAssociations = 'template_instance' | 'created_by'

declare interface ISuperCampaign<A extends ISuperCampaignAssociations = ''>
  extends IModel<'super_campaign'> {
  created_by: 'created_by' extends A ? IUser : UUID
  brand: UUID
  due_at: Nullable<number>
  executed_at?: number
  subject?: string
  description?: string
  template_instance?: 'template_instance' extends A
    ? IMarketingTemplateInstance
    : UUID
  tags: Nullable<string[]>
  eligible_brands: Nullable<UUID[]>
  enrollments_count: number
  delivered: number
  opened: number
  clicked: number
  unsubscribed: number
}
