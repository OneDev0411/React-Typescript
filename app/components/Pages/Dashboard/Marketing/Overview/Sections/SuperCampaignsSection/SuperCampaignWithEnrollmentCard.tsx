import { useState } from 'react'

import SuperCampaignPreviewDrawer, {
  SuperCampaignPreviewDrawerProps
} from '@app/views/components/SuperCampaignPreviewDrawer'

import SuperCampaignCard from './SuperCampaignCard'
import SuperCampaignWithEnrollmentCardEnrolledFooter from './SuperCampaignWithEnrollmentCardEnrolledFooter'
import SuperCampaignWithEnrollmentCardManagementFooter from './SuperCampaignWithEnrollmentCardManagementFooter'
import SuperCampaignWithEnrollmentCardParticipateFooter from './SuperCampaignWithEnrollmentCardParticipateFooter'
import { useHasSuperCampaignManageAccess } from './use-has-super-campaign-manage-access'

interface SuperCampaignWithEnrollmentCardProps
  extends Pick<SuperCampaignPreviewDrawerProps, 'onEnroll' | 'onUnenroll'> {
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

  const isAdminMode = !enrollment && hasManageAccess

  return (
    <>
      <SuperCampaignCard
        superCampaign={superCampaign}
        descriptionLineCount={getBestDescriptionLineCount()}
        to={
          isAdminMode
            ? `/dashboard/insights/super-campaign/${superCampaign.id}/detail?backUrl=/dashboard/marketing`
            : undefined
        }
        onClick={!isAdminMode ? openPreviewDrawer : undefined}
      >
        {enrollment ? (
          <SuperCampaignWithEnrollmentCardEnrolledFooter
            superCampaignTags={enrollment.tags}
          />
        ) : isAdminMode ? (
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
        {...otherProps}
      />
    </>
  )
}

export default SuperCampaignWithEnrollmentCard
