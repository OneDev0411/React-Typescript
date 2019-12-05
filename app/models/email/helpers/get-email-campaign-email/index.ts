export function getEmailCampaignEmail(
  emailCampaign: IEmailCampaign<'emails', any, 'email'>
): IEmail | null {
  const emailCampaignEmail = emailCampaign.emails && emailCampaign.emails[0]

  return emailCampaignEmail && emailCampaignEmail.email
}
