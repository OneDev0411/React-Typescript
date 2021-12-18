/**
 * A helper function to calc the time difference between due at and current time
 * @param dueAt
 * @returns Return the time difference in milliseconds
 */
export function getSuperCampaignDueAtRemainingTimeInMilliSeconds(
  dueAt: number
): number {
  const currentTime = new Date().getTime()

  return dueAt * 1000 - currentTime
}

export function convertTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

export function convertDateToTimestamp(date: Date): number {
  return date.getTime() / 1000
}

function calcPercentage(value: number, total: number): string {
  if (!total) {
    return ''
  }

  const percentage = Math.round((value / total) * 100)

  return `(${percentage}%)`
}

export interface GetSuperCampaignStatsLabelsInput {
  sent: number
  delivered: number
  opened: number
  clicked: number
}

interface GetSuperCampaignStatsLabels {
  deliveredLabel: string
  openedLabel: string
  clickedLabel: string
}

export function getSuperCampaignStatsLabels({
  sent,
  delivered,
  opened,
  clicked
}: GetSuperCampaignStatsLabelsInput): GetSuperCampaignStatsLabels {
  return {
    deliveredLabel: `${delivered} ${calcPercentage(delivered, sent)}`,
    openedLabel: `${opened} ${calcPercentage(opened, delivered)}`,
    clickedLabel: `${clicked} ${calcPercentage(clicked, delivered)}`
  }
}
