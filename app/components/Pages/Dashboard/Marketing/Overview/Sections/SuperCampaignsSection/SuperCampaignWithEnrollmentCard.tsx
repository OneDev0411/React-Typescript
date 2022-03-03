import { useState } from 'react'

import SuperCampaignPreviewDrawer from '@app/views/components/SuperCampaignPreviewDrawer'

import SuperCampaignCard from './SuperCampaignCard'
import SuperCampaignWithEnrollmentCardEnrolledFooter from './SuperCampaignWithEnrollmentCardEnrolledFooter'
import SuperCampaignWithEnrollmentCardManagementFooter from './SuperCampaignWithEnrollmentCardManagementFooter'
import SuperCampaignWithEnrollmentCardParticipateFooter from './SuperCampaignWithEnrollmentCardParticipateFooter'
import { useHasSuperCampaignManageAccess } from './use-has-super-campaign-manage-access'

interface SuperCampaignWithEnrollmentCardProps {
  superCampaignWithEnrollment: ISuperCampaignWithEnrollment
}

function SuperCampaignWithEnrollmentCard({
  superCampaignWithEnrollment: { enrollment, ...superCampaign },
  ...otherProps
}: SuperCampaignWithEnrollmentCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const hasManageAccess = useHasSuperCampaignManageAccess(superCampaign)

  const openPreviewDrawer = () => setIsPreviewOpen(true)

  const closePreviewDrawer = () => setIsPreviewOpen(false)

  const getBestDescriptionLineCount = () => {
    if (enrollment) {
      return 3
    }

    if (hasManageAccess) {
      return 6
    }

    return 4
  }

  return (
    <>
      <SuperCampaignCard
        superCampaign={superCampaign}
        descriptionLineCount={getBestDescriptionLineCount()}
        to={
          hasManageAccess
            ? `/dashboard/insights/super-campaign/${superCampaign.id}/detail?backUrl=/dashboard/marketing`
            : undefined
        }
        onClick={!hasManageAccess ? openPreviewDrawer : undefined}
      >
        {enrollment ? (
          <SuperCampaignWithEnrollmentCardEnrolledFooter
            superCampaignTags={enrollment.tags}
          />
        ) : hasManageAccess ? (
          <SuperCampaignWithEnrollmentCardManagementFooter />
        ) : (
          <SuperCampaignWithEnrollmentCardParticipateFooter />
        )}
      </SuperCampaignCard>
      <SuperCampaignPreviewDrawer
        open={isPreviewOpen}
        onClose={closePreviewDrawer}
        superCampaign={superCampaign}
        hasUnenroll={!!enrollment}
        initialSelectedTags={enrollment?.tags}
      />
    </>
  )
}

export default SuperCampaignWithEnrollmentCard
