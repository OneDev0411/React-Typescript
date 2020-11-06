import Fetch from 'services/fetch'

import { toEntityAssociation } from 'utils/association-utils'

import {
  DEFAULT_EMAIL_ASSOCIATIONS,
  DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS,
  DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS,
  GetEmailCampaignsAssociations
} from '../get-email-campaigns'

interface GetEmailCampaignAssociations<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation,
  E extends IEmailOptionalFields
> extends GetEmailCampaignsAssociations<A1, A2, A3> {
  emailFields?: E[]
  /**
   * if passed and `emails` exists in emailCampaignAssociations, association
   * condition to {'email_campaign.emails': {contact: contactId}} will be sent
   * in association_condition which means only emails that are associated with
   * the given contact will be returned under `emails`.
   */
  contactId?: string
  limit?: number
}

export async function getEmailCampaign<
  A1 extends IEmailCampaignAssociation,
  A2 extends IEmailCampaignRecipientAssociation,
  A3 extends IEmailCampaignEmailAssociation,
  E extends IEmailOptionalFields
>(
  id: string,
  associations: GetEmailCampaignAssociations<A1, A2, A3, E> = {}
): Promise<IEmailCampaign<A1, A2, A3, E>> {
  const {
    emailCampaignAssociations = DEFAULT_EMAIL_ASSOCIATIONS as A1[],
    emailRecipientsAssociations = DEFAULT_EMAIL_RECIPIENT_ASSOCIATIONS as A2[],
    emailCampaignEmailsAssociation = DEFAULT_EMAIL_CAMPAIGN_EMAIL_ASSOCIATIONS as A3[],
    emailFields = [] as E[],
    contactId,
    limit
  } = associations

  const contactIdValue = contactId ? { contact: contactId } : {}
  const limitValue = limit ? { limit } : {}
  const associationCondition =
    contactId || limit
      ? { 'email_campaign.emails': { ...contactIdValue, ...limitValue } }
      : {}

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
    select: emailFields.map(toEntityAssociation('email')),
    association_condition: associationCondition
  })

  return response.body.data
}
