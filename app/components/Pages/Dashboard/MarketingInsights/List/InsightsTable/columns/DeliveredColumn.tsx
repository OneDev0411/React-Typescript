import { calculatePrecentage } from '../helpers/calculate-precentage'
import { getValuePercent } from '../helpers/get-value-percent'

import { StatsColumn } from './StatsColumn'

interface Props {
  item: IEmailCampaign<'template'>
}

export function DeliveredColumn({ item }: Props) {
  if (!item.executed_at) {
    return null
  }

  const title = `Delivered: 
  ${getValuePercent(
    item.delivered,
    calculatePrecentage(item.delivered, item.sent)
  )}`

  const tooltip = `${getValuePercent(
    item.failed,
    calculatePrecentage(item.failed, item.sent)
  )} Bounced`

  return <StatsColumn title={title} tooltip={tooltip} />
}
