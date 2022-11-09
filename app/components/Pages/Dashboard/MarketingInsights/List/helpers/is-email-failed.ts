export function isEmailFailed(item: IEmailCampaign<'template'>) {
  return !!item.failed_at
}
