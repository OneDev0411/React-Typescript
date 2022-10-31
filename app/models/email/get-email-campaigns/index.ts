import Fetch from 'services/fetch'

export const DefaultAssociations: {
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
  order: string
  associations: {
    associations?: IEmailCampaignAssociation[]
    recipientsAssociations?: IEmailCampaignRecipientAssociation[]
    emailsAssociations?: IEmailCampaignEmailAssociation[]
  }
  status?: 'any' | 'draft' | 'scheduled' | 'executed'
}

export async function getEmailCampaigns<
  T extends IEmailCampaignAssociation,
  U extends IEmailCampaignRecipientAssociation,
  V extends IEmailCampaignEmailAssociation
>(
  brandId: Nullable<UUID>,
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
  if (!brandId) {
    throw new Error('BrandId is null')
  }

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
      status: query.status,
      order: query.order,
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
