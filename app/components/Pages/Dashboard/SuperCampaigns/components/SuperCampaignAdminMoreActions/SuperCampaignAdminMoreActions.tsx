import {
  IconButton,
  MenuItem,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import {
  useDeleteSuperCampaign,
  useDuplicateSuperCampaign,
  useSendSuperCampaign
} from '@app/models/super-campaign'
import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isSuperCampaignReadOnly } from '../../helpers'

interface SuperCampaignAdminMoreActionsProps {
  className?: string
  superCampaign: ISuperCampaign<'template_instance'>
  displaySendNow?: boolean
  onDeleteSuccess?: () => void
  onDuplicateSuccess?: (
    superCampaign: ISuperCampaign<'template_instance'>
  ) => void
  onSendSuccess?: (superCampaign: ISuperCampaign<'template_instance'>) => void
}

function SuperCampaignAdminMoreActions({
  className,
  superCampaign,
  displaySendNow = true,
  onDeleteSuccess,
  onDuplicateSuccess,
  onSendSuccess
}: SuperCampaignAdminMoreActionsProps) {
  const { mutate: deleteSuperCampaign, isLoading: isDeleting } =
    useDeleteSuperCampaign(superCampaign, { onSuccess: onDeleteSuccess })

  const { mutate: duplicateSuperCampaign, isLoading: isDuplicating } =
    useDuplicateSuperCampaign(superCampaign, {
      onSuccess: onDuplicateSuccess
    })

  const { mutate: sendSuperCampaign, isLoading: isSending } =
    useSendSuperCampaign(superCampaign, {
      onSuccess: onSendSuccess
    })

  const isExecuted = isSuperCampaignReadOnly(superCampaign)

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
          {!isExecuted && displaySendNow && (
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
