declare type ISuperCampaignEnrollmentAssociations =
  | 'user'
  | 'brand'
  | 'campaign'

declare interface ISuperCampaignEnrollment<
  A extends ISuperCampaignEnrollmentAssociations = ''
> extends Pick<
    IModel<'super_campaign_enrollment'>,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
  > {
  super_campaign: UUID
  brand: 'brand' extends A ? IBrand : never
  user: 'user' extends A ? IUser : never
  campaign: 'campaign' extends A ? Nullable<IEmailCampaign> : never
  tags: string[]
  notifications_enabled: boolean
}
