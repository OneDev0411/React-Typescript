import { makeStyles, Typography } from '@material-ui/core'
import pluralize from 'pluralize'

const useStyles = makeStyles(
  theme => ({
    root: {
      color: theme.palette.grey[700]
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
    <Typography className={classes.root} variant="body1">
      {pluralize('Participant', participantsCount, true)}
    </Typography>
  )
}

export default SuperCampaignResultListHeaderParticipants
