import {
  IconButton,
  MenuItem,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useIsSuperCampaignReadOnly } from '../../hooks/use-is-super-campaign-read-only'

import { useDeleteSuperCampaign } from './use-delete-super-campaign'
import { useDuplicateSuperCampaign } from './use-duplicate-super-campaign'
import { useSendSuperCampaign } from './use-send-super-campaign'

interface SuperCampaignAdminMoreActionsProps {
  className?: string
  superCampaign: ISuperCampaign
  onSendNow: (superCampaign: ISuperCampaign) => void
  onDelete: () => void
  onDuplicate: (superCampaign: ISuperCampaign) => void
}

function SuperCampaignAdminMoreActions({
  className,
  superCampaign,
  onDelete,
  onDuplicate,
  onSendNow
}: SuperCampaignAdminMoreActionsProps) {
  const { deleteSuperCampaign, isDeleting } = useDeleteSuperCampaign(
    superCampaign,
    onDelete
  )
  const { duplicateSuperCampaign, isDuplicating } = useDuplicateSuperCampaign(
    superCampaign,
    onDuplicate
  )
  const { sendSuperCampaign, isSending } = useSendSuperCampaign(
    superCampaign,
    onSendNow
  )

  const isExecuted = useIsSuperCampaignReadOnly(superCampaign)

  const isWorking = isDeleting || isDuplicating || isSending

  return (
    <BaseDropdown
      PopperProps={{
        placement: 'bottom-end'
      }}
      renderDropdownButton={({ isActive, ...buttonProps }) => (
        <IconButton
          {...buttonProps}
          className={className}
          size="small"
          disabled={isWorking}
        >
          {isWorking ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SvgIcon path={mdiDotsVertical} />
          )}
        </IconButton>
      )}
      renderMenu={({ close }) => (
        <div onClick={close}>
          {!isExecuted && (
            <MenuItem onClick={sendSuperCampaign}>
              <Typography variant="body2">Send Now</Typography>
            </MenuItem>
          )}
          <MenuItem onClick={duplicateSuperCampaign}>
            <Typography variant="body2">Duplicate this campaign</Typography>
          </MenuItem>
          {!isExecuted && (
            <MenuItem onClick={deleteSuperCampaign}>
              <Typography variant="body2">Delete</Typography>
            </MenuItem>
          )}
        </div>
      )}
    />
  )
}

export default SuperCampaignAdminMoreActions
