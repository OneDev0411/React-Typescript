import { IconButton } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { useDeleteSuperCampaignEnrollment } from '@app/models/super-campaign'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SuperCampaignOptedOutChip from './SuperCampaignOptedOutChip'

interface SuperCampaignEnrollmentListColumnActionsProps {
  className?: string
  superCampaignEnrollment: ISuperCampaignEnrollment<'user' | 'brand'>
  isOptedOut: boolean
}

function SuperCampaignEnrollmentListColumnActions({
  className,
  isOptedOut,
  superCampaignEnrollment
}: SuperCampaignEnrollmentListColumnActionsProps) {
  const { isLoading: isDeleting, mutate } = useDeleteSuperCampaignEnrollment()

  const handleDelete = () =>
    mutate({
      superCampaignId: superCampaignEnrollment.super_campaign,
      userId: superCampaignEnrollment.user.id,
      brandId: superCampaignEnrollment.brand.id
    })

  if (isOptedOut) {
    return <SuperCampaignOptedOutChip />
  }

  return (
    <IconButton
      className={className}
      size="small"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <SvgIcon path={mdiTrashCanOutline} />
    </IconButton>
  )
}

export default SuperCampaignEnrollmentListColumnActions
