import { IconButton } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import useSafeState from '@app/hooks/use-safe-state'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SuperCampaignOptedOutChip from './SuperCampaignOptedOutChip'

interface SuperCampaignEnrollmentListColumnActionsProps {
  isOptedOut: boolean
  onDelete: () => Promise<void>
}

function SuperCampaignEnrollmentListColumnActions({
  isOptedOut,
  onDelete
}: SuperCampaignEnrollmentListColumnActionsProps) {
  const [isDeleting, setIsDeleting] = useSafeState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete()
    setIsDeleting(false)
  }

  if (isOptedOut) {
    return <SuperCampaignOptedOutChip />
  }

  return (
    <IconButton size="small" onClick={handleDelete} disabled={isDeleting}>
      <SvgIcon path={mdiTrashCanOutline} />
    </IconButton>
  )
}

export default SuperCampaignEnrollmentListColumnActions
