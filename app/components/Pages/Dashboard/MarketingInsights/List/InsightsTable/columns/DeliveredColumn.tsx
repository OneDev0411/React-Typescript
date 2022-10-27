import { hasPixelTracking } from '../../helpers/has-pixel-tracking'
import { getValuePercent } from '../helpers/get-value-percent'

import { StatsColumn } from './StatsColumn'

interface Props {
  item: IEmailCampaign<'template'>
}

export function DeliveredColumn({ item }: Props) {
  if (!item.executed_at || hasPixelTracking(item)) {
    return null
  }

  return (
    <StatsColumn
      title={`Delivered: ${getValuePercent(item.delivered, item.sent)}`}
      tooltip={`${getValuePercent(item.failed, item.sent)} Bounced`}
    />
  )
}
