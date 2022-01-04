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

  return (
    <>
      <SuperCampaignCard
        superCampaign={superCampaign}
        descriptionLineCount={enrollment || hasManageAccess ? 3 : 4}
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
        {...otherProps}
      />
    </>
  )
}

export default SuperCampaignWithEnrollmentCard
