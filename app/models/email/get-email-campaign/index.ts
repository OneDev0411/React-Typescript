import Fetch from 'services/fetch'
import { toEntityAssociation } from 'utils/association-utils'

const DEFAULT_EMAIL_ASSOCIATIONS: IEmailCampaignAssociation[] = [
  'emails',
  'template',
  'from',
  'recipients',
  'attachments'
]

const DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS: IEmailCampaignRecipientAssociation[] = [
  'contact',
  'list',
  'brand',
  'agent'
]

const DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS: IEmailCampaignEmailAssociation[] = [
  'email'
]

interface GetEmailCampaignParams<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation,
  E extends IEmailOptionalFields
> {
  emailCampaignAssociations?: A1[]
  emailRecipientsAssociations?: A2[]
  emailCampaignEmailsAssociation?: A3[]
  emailFields?: E[]
}

export async function getEmailCampaign<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation,
  E extends IEmailOptionalFields
>(
  id: string,
  {
    emailCampaignAssociations = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
    emailRecipientsAssociations = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[],
    emailCampaignEmailsAssociation = DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS as A3[],
    emailFields = [] as E[]
  }: GetEmailCampaignParams<A1, A2, A3, E> = {}
): Promise<IEmailCampaign<A1, A2, A3, E>> {
  const response = await new Fetch().get(`/emails/${id}`).query({
    associations: [
      ...emailCampaignAssociations.map(toEntityAssociation('email_campaign')),
      ...emailRecipientsAssociations.map(
        toEntityAssociation('email_campaign_recipient')
      ),
      ...emailCampaignEmailsAssociation.map(
        toEntityAssociation('email_campaign_email')
      )
    ],
    select: emailFields.map(toEntityAssociation('email'))
  })

  return response.body.data as IEmailCampaign<A1, A2, A3, E>
}
