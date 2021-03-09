import timeago from 'timeago.js'

export function getHumanReadableExecutionStatus(
  campaign: IEmailCampaign
): string {
  if (campaign.executed_at) {
    return `Sent ${timeago().format(campaign.executed_at * 1000)}`
  }

  const now = new Date().getTime()

  if (campaign.due_at * 1000 > now) {
    return `Will be sent ${timeago().format(campaign.due_at * 1000)}`
  }

  return 'Sending is in progress'
}
