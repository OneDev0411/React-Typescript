import SuperCampaignCard from './SuperCampaignCard'
import SuperCampaignWithEnrollmentCardEnrolledFooter from './SuperCampaignWithEnrollmentCardEnrolledFooter'
import SuperCampaignWithEnrollmentCardParticipateFooter from './SuperCampaignWithEnrollmentCardParticipateFooter'
import { SuperCampaignWithEnrollment } from './types'
import { useHasSuperCampaignManageAccess } from './use-has-super-campaign-manage-access'

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
  const hasManageAccess = useHasSuperCampaignManageAccess(superCampaign)

  // TODO: Complete the drawer logic here
  const openSuperCampaignPreviewDrawer = () =>
    console.log('openSuperCampaignPreviewDrawer')

  return (
    <SuperCampaignCard
      superCampaign={superCampaign}
      descriptionLineCount={enrollment ? 3 : 4}
      to={
        hasManageAccess
          ? `/dashboard/insights/super-campaign/${superCampaign.id}/detail`
          : undefined
      }
      onClick={!hasManageAccess ? openSuperCampaignPreviewDrawer : undefined}
    >
      {enrollment ? (
        <SuperCampaignWithEnrollmentCardEnrolledFooter
          superCampaignTags={enrollment.tags}
        />
      ) : (
        <SuperCampaignWithEnrollmentCardParticipateFooter
          isEnrolling={false} // TODO: pass a real value here
        />
      )}
    </SuperCampaignCard>
  )
}

export default SuperCampaignWithEnrollmentCard
