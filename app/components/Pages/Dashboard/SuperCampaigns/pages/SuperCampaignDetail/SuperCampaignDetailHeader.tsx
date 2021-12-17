import { makeStyles } from '@material-ui/core'

import SuperCampaignCloseButton from './SuperCampaignCloseButton'
import SuperCampaignDetailHeaderMoreActions from './SuperCampaignDetailHeaderMoreActions'
import SuperCampaignDetailHeaderSchedule, {
  SuperCampaignDetailHeaderScheduleProps
} from './SuperCampaignDetailHeaderSchedule'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    margin: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignDetailHeader' }
)

interface SuperCampaignDetailHeaderProps
  extends Pick<SuperCampaignDetailHeaderScheduleProps, 'setSuperCampaign'> {
  superCampaign: Nullable<ISuperCampaign<'template_instance'>>
}

function SuperCampaignDetailHeader({
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {superCampaign && (
        <>
          <SuperCampaignDetailHeaderSchedule
            className={classes.margin}
            superCampaign={superCampaign}
            setSuperCampaign={setSuperCampaign}
          />
          <SuperCampaignDetailHeaderMoreActions
            className={classes.margin}
            superCampaign={superCampaign}
            setSuperCampaign={setSuperCampaign}
          />
        </>
      )}
      <SuperCampaignCloseButton />
    </div>
  )
}

export default SuperCampaignDetailHeader
