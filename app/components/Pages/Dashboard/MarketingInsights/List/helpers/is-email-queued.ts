export function isEmailQueued(item: IEmailCampaign<'template'>) {
  const now = new Date().getTime()

  return item.due_at * 1000 > now
}
