import { EmailThreadEmail } from 'components/EmailThread/types'

export type FollowUpEmail =
  | IEmailCampaign<
      IEmailCampaignAssociation,
      IEmailCampaignRecipientAssociation,
      IEmailCampaignEmailAssociation
    >
  | EmailThreadEmail
  | null
