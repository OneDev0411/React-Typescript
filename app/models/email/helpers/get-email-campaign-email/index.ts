export function getEmailCampaignEmail(
  emailCampaign: IEmailCampaign<
    'emails' | 'attachments',
    any,
    'email',
    IEmailOptionalFields
  >
): IEmail<IEmailOptionalFields> | null {
  const emailCampaignEmail = emailCampaign.emails?.[0] ?? null
  const email = emailCampaignEmail?.email as IEmail<IEmailOptionalFields> | null

  if (email) {
    email.attachments = emailCampaign.attachments
  }

  return email
}
