import { makeStyles, Button } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(1, 2, 2, 2) }
  }),
  { name: 'SuperCampaignWithEnrollmentCardParticipateFooter' }
)

interface SuperCampaignWithEnrollmentCardParticipateFooterProps {
  isEnrolling: boolean
}

function SuperCampaignWithEnrollmentCardParticipateFooter({
  isEnrolling
}: SuperCampaignWithEnrollmentCardParticipateFooterProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        size="small"
        disabled={isEnrolling}
        component="div"
        tabIndex={-1}
      >
        Add Tags to Participate
      </Button>
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardParticipateFooter
