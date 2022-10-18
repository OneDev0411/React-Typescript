import pluralize from 'pluralize'

import { valueAndPercent } from '../../../List.bkp/helpers'
import { hasPixelTracking } from '../../helpers/has-pixel-tracking'

import { StatsColumn } from './StatsColumn'

interface Props {
  item: IEmailCampaign<'template'>
}

export function ClickedColumn({ item }: Props) {
  if (!item.executed_at) {
    return null
  }

  if (hasPixelTracking(item)) {
    return (
      <StatsColumn
        title={`Clicks: ${item.clicked}`}
        tooltip={`Email is clicked ${pluralize('time', item.clicked, true)}`}
      />
    )
  }

  return (
    <StatsColumn
      title={`Clicked: ${valueAndPercent(item.clicked, item.delivered)}`}
      tooltip={`${item.clicked} People have clicked the email`}
    />
  )
}
