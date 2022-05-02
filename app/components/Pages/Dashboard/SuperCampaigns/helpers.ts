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

export function isSuperCampaignExecuted(
  superCampaign: Pick<ISuperCampaign, 'executed_at'>
): boolean {
  return !!superCampaign.executed_at
}

export function isSuperCampaignDueAtTimeout(
  superCampaign: Pick<ISuperCampaign, 'due_at'>
): boolean {
  return (
    !!superCampaign.due_at &&
    getSuperCampaignDueAtRemainingTimeInMilliSeconds(superCampaign.due_at) < 0
  )
}

export function isSuperCampaignReadOnly(
  superCampaign: Pick<ISuperCampaign, 'executed_at' | 'due_at'>
): boolean {
  const isExecuted = isSuperCampaignExecuted(superCampaign)
  const isDueAtTimeout = isSuperCampaignDueAtTimeout(superCampaign)

  return isExecuted || isDueAtTimeout
}

export function toRawSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>
): ISuperCampaign {
  return {
    ...superCampaign,
    template_instance: superCampaign.template_instance?.id
  }
}
