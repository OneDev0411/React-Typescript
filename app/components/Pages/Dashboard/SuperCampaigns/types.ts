export type SuperCampaignDetailTabType = 'Overview' | 'Results'

export interface SuperCampaignEnrollmentInput {
  user: IUser
  brand: IBrand
  tags: string[]
}
