import { makeStyles } from '@material-ui/core'

import SuperCampaignCard from './SuperCampaignCard'
import SuperCampaignWithEnrollmentCardEnrolledFooter from './SuperCampaignWithEnrollmentCardEnrolledFooter'
import SuperCampaignWithEnrollmentCardParticipateFooter from './SuperCampaignWithEnrollmentCardParticipateFooter'
import { SuperCampaignWithEnrollment } from './types'

const useStyles = makeStyles(
  theme => ({
    root: { minHeight: theme.spacing(23) }
  }),
  { name: 'SuperCampaignWithEnrollmentCard' }
)

interface SuperCampaignWithEnrollmentCardProps {
  superCampaignWithEnrollment: SuperCampaignWithEnrollment
  onEnroll: (enrollment: ISuperCampaignEnrollment) => void
  onUnenroll: () => void
}

function SuperCampaignWithEnrollmentCard({
  superCampaignWithEnrollment: { enrollment, ...superCampaign },
  onEnroll,
  onUnenroll
}: SuperCampaignWithEnrollmentCardProps) {
  const classes = useStyles()

  const hasEnrolled = !!enrollment

  return (
    <SuperCampaignCard className={classes.root} superCampaign={superCampaign}>
      {hasEnrolled ? (
        <SuperCampaignWithEnrollmentCardEnrolledFooter
          superCampaignId={superCampaign.id}
          superCampaignTags={enrollment.tags}
          onUpdate={onEnroll}
          onUnenroll={onUnenroll}
        />
      ) : (
        <SuperCampaignWithEnrollmentCardParticipateFooter
          superCampaignId={superCampaign.id}
          superCampaignTags={superCampaign.tags ?? []}
          onEnroll={onEnroll}
        />
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignWithEnrollmentCard
