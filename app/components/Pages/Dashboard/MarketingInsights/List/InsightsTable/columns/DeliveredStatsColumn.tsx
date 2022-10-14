import { makeStyles, Theme, Tooltip } from '@material-ui/core'

import { hasPixelTracking } from '../../helpers/has-pixel-tracking'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    cursor: 'help'
  }
}))

interface Props {
  item: IEmailCampaign<'template'>
}

export function DeliveredStatsColumn({ item }: Props) {
  const classes = useStyles()

  if (!item.executed_at || hasPixelTracking(item)) {
    return null
  }

  const tooltip = `${getValuePercent(
    item.failed,
    calculatePrecentage(item.failed, item.sent)
  )} Bounced`

  return (
    <Tooltip title={tooltip}>
      <span className={classes.root}>
        Delivered:{' '}
        {getValuePercent(
          item.delivered,
          calculatePrecentage(item.delivered, item.sent)
        )}
      </span>
    </Tooltip>
  )
}

function calculatePrecentage(value: number, total: number): number {
  if (value === 0 || total === 0) {
    return 0
  }

  return Math.floor((value * 100) / total)
}

function getValuePercent(value: number, percent: number): string {
  return percent === 0 ? value.toString() : `${value} (${percent}%)`
}
