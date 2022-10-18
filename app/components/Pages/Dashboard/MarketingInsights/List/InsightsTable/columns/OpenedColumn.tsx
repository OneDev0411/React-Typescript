import pluralize from 'pluralize'

import { valueAndPercent } from '../../../List.bkp/helpers'
import { hasPixelTracking } from '../../helpers/has-pixel-tracking'

import { StatsColumn } from './StatsColumn'

interface Props {
  item: IEmailCampaign<'template'>
}

export function OpenedColumn({ item }: Props) {
  if (!item.executed_at) {
    return null
  }

  if (hasPixelTracking(item)) {
    return (
      <StatsColumn
        title={`Opens: ${item.opened}`}
        tooltip={`Email is opened ${pluralize('time', item.opened, true)}`}
      />
    )
  }

  return (
    <StatsColumn
      title={`Opened: ${valueAndPercent(item.opened, item.delivered)}`}
      tooltip={`${item.opened} People have opened the email`}
    />
  )
}
