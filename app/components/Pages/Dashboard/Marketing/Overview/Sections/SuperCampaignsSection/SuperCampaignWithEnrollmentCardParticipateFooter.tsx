import { makeStyles, Button } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(1, 2, 2, 2) }
  }),
  { name: 'SuperCampaignWithEnrollmentCardParticipateFooter' }
)

function SuperCampaignWithEnrollmentCardParticipateFooter() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        size="small"
        component="div"
        tabIndex={-1}
      >
        Preview and Participate
      </Button>
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardParticipateFooter
