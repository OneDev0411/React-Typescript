declare type ISuperCampaignEnrollmentAssociations =
  | 'user'
  | 'brand'
  | 'campaign'
  | 'user_and_brand'
  | 'user_and_brand_and_campaign'

declare interface ISuperCampaignEnrollment<
  A extends ISuperCampaignEnrollmentAssociations = ''
> extends Pick<
    IModel<'super_campaign_enrollment'>,
    'id' | 'created_at' | 'updated_at' | 'deleted_at'
  > {
  super_campaign: UUID
  brand: A extends 'brand' | 'user_and_brand' | 'user_and_brand_and_campaign'
    ? IBrand
    : never
  user: A extends 'user' | 'user_and_brand' | 'user_and_brand_and_campaign'
    ? IUser
    : never
  campaign: A extends 'campaign' | 'user_and_brand_and_campaign'
    ? IEmailCampaign
    : never
  tags: string[]
}
