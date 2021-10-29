import { makeStyles, Typography } from '@material-ui/core'
import { mdiAccountGroupOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      width: theme.spacing(3),
      textAlign: 'center',
      margin: theme.spacing(0, 1)
    },
    label: {
      color: theme.palette.grey[500],
      marginLeft: theme.spacing(0.5)
    }
  }),
  { name: 'SuperCampaignResultListHeaderParticipants' }
)

interface SuperCampaignResultListHeaderParticipantsProps {
  participantsCount: number
}

function SuperCampaignResultListHeaderParticipants({
  participantsCount
}: SuperCampaignResultListHeaderParticipantsProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.icon}>
        <SvgIcon path={mdiAccountGroupOutline} size={muiIconSizes.small} />{' '}
      </div>
      <Typography variant="subtitle2">
        {participantsCount}
        <span className={classes.label}>
          Participant{participantsCount !== 1 ? 's' : ''}
        </span>
      </Typography>
    </div>
  )
}

export default SuperCampaignResultListHeaderParticipants
