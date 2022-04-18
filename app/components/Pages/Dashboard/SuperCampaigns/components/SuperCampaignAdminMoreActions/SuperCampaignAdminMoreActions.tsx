import {
  IconButton,
  MenuItem,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { mdiDotsVertical } from '@mdi/js'

import { ACL } from '@app/constants/acl'
import {
  useDeleteSuperCampaign,
  useDuplicateSuperCampaign,
  useSendSuperCampaign
} from '@app/models/super-campaign'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { BaseDropdown } from '@app/views/components/BaseDropdown'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { isSuperCampaignReadOnly, toRawSuperCampaign } from '../../helpers'

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
    useDeleteSuperCampaign({ onSuccess: onDeleteSuccess })

  const { mutate: duplicateSuperCampaign, isLoading: isDuplicating } =
    useDuplicateSuperCampaign({
      onSuccess: onDuplicateSuccess
    })

  const { mutate: sendSuperCampaign, isLoading: isSending } =
    useSendSuperCampaign({
      onSuccess: onSendSuccess
    })

  const isExecuted = isSuperCampaignReadOnly(superCampaign)

  const hasBetaAccess = useAcl(ACL.BETA)

  const isWorking = isDeleting || isDuplicating || isSending

  // TODO: Remove this line and the if statement when the duplicate button is available without beta access
  const hasItemsToShow =
    (!isExecuted && displaySendNow) || hasBetaAccess || !isExecuted

  if (!hasItemsToShow) {
    return null
  }

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
            <MenuItem onClick={() => sendSuperCampaign(superCampaign)}>
              <Typography variant="body2">Send Now</Typography>
            </MenuItem>
          )}
          {hasBetaAccess && (
            <MenuItem
              onClick={() =>
                duplicateSuperCampaign(toRawSuperCampaign(superCampaign))
              }
            >
              <Typography variant="body2">Duplicate this campaign</Typography>
            </MenuItem>
          )}
          {!isExecuted && (
            <MenuItem onClick={() => deleteSuperCampaign(superCampaign)}>
              <Typography variant="body2">Delete</Typography>
            </MenuItem>
          )}
        </div>
      )}
    />
  )
}

export default SuperCampaignAdminMoreActions
