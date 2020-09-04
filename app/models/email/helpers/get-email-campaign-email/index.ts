export function getEmailCampaignEmail(
  emailCampaign: IEmailCampaign<'emails', any, 'email', IEmailOptionalFields>
): IEmail<IEmailOptionalFields> | null {
  const emailCampaignEmail = emailCampaign.emails && emailCampaign.emails[0]

  return (
    emailCampaignEmail &&
    (emailCampaignEmail.email as IEmail<IEmailOptionalFields>)
  )
}
