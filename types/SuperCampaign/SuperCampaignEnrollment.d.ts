declare type ISuperCampaignEnrollmentAssociations =
  | 'user'
  | 'brand'
  | 'user_and_brand'

declare interface ISuperCampaignEnrollment<
  A extends ISuperCampaignEnrollmentAssociations = ''
> extends Pick<
    IModel<'super_campaign_enrollment'>,
    'id' | 'created_at' | 'updated_at'
  > {
  super_campaign: UUID
  brand: A extends 'brand' | 'user_and_brand' ? IBrand : never
  user: A extends 'user' | 'user_and_brand' ? IUser : never
  tags: string[]
}
