import { Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(1, 2),
      backgroundColor: theme.palette.info.ultralight,
      color: theme.palette.info.dark,
      minHeight: theme.spacing(9),
      position: 'relative'
    }
  }),
  { name: 'SuperCampaignWithEnrollmentCardManagementFooter' }
)

function SuperCampaignWithEnrollmentCardManagementFooter() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="caption">
        24 users from 18 teams and offices participate in this campaign.
      </Typography>
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardManagementFooter
