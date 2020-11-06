import { EmailThreadEmail } from 'components/EmailThread/types'

export type FollowUpEmailCampaign = IEmailCampaign<
  'emails' | 'template' | 'from' | 'recipients',
  'contact',
  'email'
>

export type FollowUpEmail = FollowUpEmailCampaign | EmailThreadEmail | null
