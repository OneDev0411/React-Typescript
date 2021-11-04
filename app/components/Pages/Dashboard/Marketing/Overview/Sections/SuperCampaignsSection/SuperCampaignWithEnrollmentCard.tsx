import { makeStyles, Button } from '@material-ui/core'

import SuperCampaignCard from './SuperCampaignCard'
import { SuperCampaignWithEnrollment } from './types'

const useStyles = makeStyles(
  theme => ({
    root: { minHeight: theme.spacing(23) },
    footer: { padding: theme.spacing(2) }
  }),
  { name: 'SuperCampaignWithEnrollmentCard' }
)

interface SuperCampaignWithEnrollmentCardProps {
  superCampaignWithEnrollment: SuperCampaignWithEnrollment
}

function SuperCampaignWithEnrollmentCard({
  superCampaignWithEnrollment: { enrollment, ...superCampaign }
}: SuperCampaignWithEnrollmentCardProps) {
  const classes = useStyles()

  return (
    <SuperCampaignCard className={classes.root} superCampaign={superCampaign}>
      {enrollment && 'You Enrolled'}
      <div className={classes.footer}>
        <Button variant="outlined" color="primary" fullWidth size="small">
          Add Tags to Participate
        </Button>
      </div>
    </SuperCampaignCard>
  )
}

export default SuperCampaignWithEnrollmentCard
