import Fetch from 'services/fetch'

import { DefaultAssociations } from '../get-email-campaigns'

interface QueryParams<T> {
  associations?: {
    associations?: IEmailCampaignAssociation[]
    recipientsAssociations?: IEmailCampaignRecipientAssociation[]
    emailsAssociations?: IEmailCampaignEmailAssociation[]
  }
  emailFields: T[]
  contactId?: UUID
  limit?: number
}

export async function getEmailCampaign<
  T extends IEmailCampaignAssociation,
  U extends IEmailCampaignRecipientAssociation,
  V extends IEmailCampaignEmailAssociation,
  W extends IEmailOptionalFields
>(id: UUID, query?: QueryParams<W>): Promise<IEmailCampaign<T, U, V, W>> {
  const {
    associations = DefaultAssociations.ASSOCIATIONS,
    recipientsAssociations = DefaultAssociations.RECIPIENT_ASSOCIATIONS,
    emailsAssociations = DefaultAssociations.EMAIL_ASSOCIATIONS
  }: QueryParams<W>['associations'] = query?.associations ?? {}

  const args = {}

  if (query?.limit) {
    args['association_condition[email_campaign.emails][limit]'] = query.limit
  }

  if (query?.contactId) {
    args['association_condition[email_campaign.emails][contact]'] =
      query.contactId
  }

  const response = await new Fetch().get(`/emails/${id}`).query({
    'associations[]': [
      ...associations.map(name => `email_campaign.${name}`),
      ...recipientsAssociations.map(name => `email_campaign_recipient.${name}`),
      ...emailsAssociations.map(name => `email_campaign_email.${name}`)
    ],
    'select[]': (query?.emailFields ?? []).map(name => `email.${name}`),
    ...args
  })

  return response.body.data
}
