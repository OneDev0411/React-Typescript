import Fetch from 'services/fetch'

const DefaultAssociations: {
  ASSOCIATIONS: IEmailCampaignAssociation[]
  RECIPIENT_ASSOCIATIONS: IEmailCampaignRecipientAssociation[]
  EMAIL_ASSOCIATIONS: IEmailCampaignEmailAssociation[]
} = {
  ASSOCIATIONS: ['emails', 'template', 'from', 'recipients', 'attachments'],
  RECIPIENT_ASSOCIATIONS: ['contact', 'list', 'brand', 'agent'],
  EMAIL_ASSOCIATIONS: ['email']
}

interface QueryParams {
  start?: number
  limit?: number
  associations: {
    associations?: string[]
    recipientsAssociations?: string[]
    emailsAssociations?: string[]
  }
  status?: 'any' | 'draft' | 'scheduled' | 'executed'
}

export async function getEmailCampaigns<
  T extends IEmailCampaignAssociation,
  U extends IEmailCampaignRecipientAssociation,
  V extends IEmailCampaignEmailAssociation
>(
  brandId: UUID,
  query: QueryParams
): Promise<
  ApiResponseBody<
    IEmailCampaign<T, U, V, never>[],
    {
      count: number
      total: number
    }
  >
> {
  const {
    associations = DefaultAssociations.ASSOCIATIONS,
    recipientsAssociations = DefaultAssociations.RECIPIENT_ASSOCIATIONS,
    emailsAssociations = DefaultAssociations.EMAIL_ASSOCIATIONS
  }: QueryParams['associations'] = query.associations

  const response = await new Fetch()
    .get(`/brands/${brandId}/emails/campaigns`)
    .query({
      start: query.start ?? 0,
      limit: query.limit ?? 5000,
      'associations[]': [
        ...associations.map(name => `email_campaign.${name}`),
        ...recipientsAssociations.map(
          name => `email_campaign_recipient.${name}`
        ),
        ...emailsAssociations.map(name => `email_campaign_email.${name}`)
      ],
      'omit[]': ['template_instance.html', 'email_campaign.html']
    })

  return response.body
}
