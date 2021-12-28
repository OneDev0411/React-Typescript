import { makeStyles } from '@material-ui/core'
import {
  mdiAccountMultipleOutline,
  mdiCheckAll,
  mdiEyeOutline,
  mdiCursorDefaultClickOutline
} from '@mdi/js'

import {
  getSuperCampaignStatsLabels,
  GetSuperCampaignStatsLabelsInput
} from '../../helpers'

import SuperCampaignStatIconLabel from './SuperCampaignStatIconLabel'

const useStyles = makeStyles(
  theme => ({
    iconLabel: { marginRight: theme.spacing(3) }
  }),
  { name: 'SuperCampaignAdminListColumnStats' }
)

type SuperCampaignAdminListColumnStatsProps = GetSuperCampaignStatsLabelsInput

function SuperCampaignAdminListColumnStats({
  sent,
  delivered,
  opened,
  clicked
}: SuperCampaignAdminListColumnStatsProps) {
  const classes = useStyles()
  const { deliveredLabel, openedLabel, clickedLabel } =
    getSuperCampaignStatsLabels({ sent, delivered, opened, clicked })

  return (
    <div>
      <SuperCampaignStatIconLabel
        className={classes.iconLabel}
        icon={mdiAccountMultipleOutline}
        label={sent}
      />
      <SuperCampaignStatIconLabel
        className={classes.iconLabel}
        icon={mdiCheckAll}
        label={deliveredLabel}
      />
      <SuperCampaignStatIconLabel
        className={classes.iconLabel}
        icon={mdiEyeOutline}
        label={openedLabel}
      />
      <SuperCampaignStatIconLabel
        className={classes.iconLabel}
        icon={mdiCursorDefaultClickOutline}
        label={clickedLabel}
      />
    </div>
  )
}

export default SuperCampaignAdminListColumnStats
