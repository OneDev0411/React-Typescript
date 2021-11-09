import SuperCampaignCard from './SuperCampaignCard'
import SuperCampaignWithEnrollmentCardEnrolledFooter from './SuperCampaignWithEnrollmentCardEnrolledFooter'
import SuperCampaignWithEnrollmentCardParticipateFooter from './SuperCampaignWithEnrollmentCardParticipateFooter'
import { SuperCampaignWithEnrollment } from './types'
import useSuperCampaignWithEnrollmentCardStyles from './use-super-campaign-with-enrollment-card-styles'

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
  const classes = useSuperCampaignWithEnrollmentCardStyles()

  return (
    <SuperCampaignCard className={classes.root} superCampaign={superCampaign}>
      {enrollment ? (
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
