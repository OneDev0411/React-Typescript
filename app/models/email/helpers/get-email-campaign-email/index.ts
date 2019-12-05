export function getEmailCampaignEmail<F extends IEmailOptionalFields>(
  emailCampaign: IEmailCampaign<'emails', any, 'email', F>
): IEmail<F> | null {
  const emailCampaignEmail = emailCampaign.emails && emailCampaign.emails[0]

  return emailCampaignEmail && (emailCampaignEmail.email as IEmail<F>)
}
